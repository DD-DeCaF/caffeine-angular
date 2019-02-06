// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, forkJoin, concat} from 'rxjs';
import {environment} from '../../environments/environment';
import * as typesDesign from '../app-design-tool/types';
import {flatMap, map, switchMap, toArray} from 'rxjs/operators';
import {Job, PathwayResponse, PathwayPredictionResult, PathwayPredictionReactions, PathwayPredictionMetabolites, IdMapperResponse} from '../jobs/types';
import {DeCaF, AddedReaction} from '../app-interactive-map/types';
import { mapBiggReactionToCobra } from '../lib';

@Injectable()
export class NinjaService {

  constructor(
    private http: HttpClient,
  ) {
  }

  postPredict(design: typesDesign.Design): Observable<typesDesign.StatePrediction> {
    const desingPredict = {
      model_name: design.model.name,
      product_name: design.product,
      model_id: design.model.id,
      project_id: design.project_id,
      organism_id: design.species.id,
      max_predictions: design.max_predictions,
      bigg: design.bigg,
      rhea: design.rhea,
      aerobic: design.aerobic,
    };
    return this.http.post<typesDesign.StatePrediction>(`${environment.apis.metabolic_ninja}/predictions`, desingPredict).pipe(map((predict) =>
      this.processPrediction(predict, design)));
  }

  getPredict(task_id: number): Observable<PathwayResponse> {
    return this.http.get<PathwayResponse>(`${environment.apis.metabolic_ninja}/predictions/${task_id}`);
  }

  processPrediction(predict: typesDesign.StatePrediction, design: typesDesign.Design): typesDesign.StatePrediction {
    return {
      ...predict,
      configuration: design,
    };
  }

  getPredictions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apis.metabolic_ninja}/predictions`).pipe(switchMap((predictions: Job[]) => {
      return this.processPredictions(predictions);
    }));
  }

  processPredictions(predictions: Job[]): Observable<Job[]> {
    const jobs$ = predictions.map((prediction) =>
      this.http.get(`${environment.apis.model_storage}/models/${prediction.model_id}`).pipe(
        map((model: DeCaF.Model) => {
          prediction.model = model;
          return prediction;
        }),
      ),
    );
    if (jobs$.length === 0) {
      return of([]);
    }
    return forkJoin(jobs$);
  }

  mapMnxMetabolitesToBigg(metaboliteIds: string[]): Observable<Object> {
    const body = {ids: metaboliteIds, dbFrom: 'mnx', dbTo: 'bigg', type: 'Metabolite'};
    const result = [];
    return this.http.post<IdMapperResponse>(`${environment.apis.id_mapper}`, body).pipe(map((response: IdMapperResponse) => {
      // console.log('IDS FUNCTION', response.ids);
      // const ids = Object.values(response.ids);
      // for (const id of ids) {
      //   result.push(id[0]);
      // }
      return response.ids;
    }));
  }

  getAddedReactions(
    pathwayPrediction: PathwayPredictionResult,
    reactions: PathwayPredictionReactions,
    metabolites: PathwayPredictionMetabolites): Observable<AddedReaction[]> {
    const addedReactions = pathwayPrediction.heterologous_reactions.map((reactionId) => {
      const metaboliteIds = Object.keys(reactions[reactionId].metabolites);
      return this.mapMnxMetabolitesToBigg(metaboliteIds).pipe(map((ids) => {
        let metabolites_to_add = [];
        let newMetabolites = {};
        let oldMetabolites = reactions[reactionId].metabolites;
        let metabolite;
        for (let mnxId in ids) {
          metabolite = metabolites[mnxId];
          metabolite.id = ids[mnxId][0];
          metabolites_to_add.push(metabolite);
          newMetabolites[ids[mnxId][0]] = oldMetabolites[mnxId];
        }
        return {
          ...reactions[reactionId],
          metabolites: newMetabolites,
          bigg_id: reactionId,
          metabolites_to_add,
        };
      }));
    });

    if (addedReactions.length === 0) {
      return of([]);
    }
    return concat(...addedReactions).pipe(toArray());
  }

  getOperations(pathwayPrediction: PathwayPredictionResult, reactions: PathwayPredictionReactions): DeCaF.Operation[] {
    let knockoutReactions = [];
    let knockoutGenes = [];
    if (pathwayPrediction.method === 'PathwayPredictor+OptGene') {
      knockoutGenes = pathwayPrediction.knockouts.map((geneId) => Object.assign({
        data: null,
        id: geneId,
        operation: 'knockout',
        type: 'gene',
      }));
    } else if (pathwayPrediction.method === 'PathwayPredictor+DifferentialFVA' || pathwayPrediction.method === 'PathwayPredictor+CofactorSwap') {
      knockoutReactions = pathwayPrediction.knockouts.map((reactionId) => Object.assign({
        data: null,
        id: reactionId,
        operation: 'knockout',
        type: 'reaction',
      }));
    } else {
      throw new Error(`Method ${pathwayPrediction.method} is not recognized.`);
    }
    const addedReactions = pathwayPrediction.heterologous_reactions.map((reactionId) => Object.assign({
      data: mapBiggReactionToCobra(reactions[reactionId]),
      id: reactionId,
      operation: 'add',
      type: 'reaction',
    }));
    return [...knockoutReactions, ...knockoutGenes, ...addedReactions];
  }
}
