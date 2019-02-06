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
import {Observable, of, forkJoin} from 'rxjs';
import {environment} from '../../environments/environment';
import * as typesDesign from '../app-design-tool/types';
import {map, switchMap} from 'rxjs/operators';
import {Job, PathwayResponse, PathwayPredictionResult, PathwayPredictionReactions, PathwayPredictionMetabolites} from '../jobs/types';
import {DeCaF, AddedReaction} from '../app-interactive-map/types';
import {mapBiggReactionToCobra} from '../lib';

@Injectable()
export class NinjaService {

  constructor(
    private http: HttpClient,
  ) {}

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
    const body = {ids: metaboliteIds, db_from: 'mnx', db_to: 'bigg', type: 'Metabolite'};
    return this.http.post(`${environment.apis.id_mapper}`, body).
      pipe(map((response) => response["ids"]));
  }

  getAddedReactions(
    pathwayPrediction: PathwayPredictionResult,
    reactions: PathwayPredictionReactions,
    metabolites: PathwayPredictionMetabolites): Observable<AddedReaction[]> {
    const addedReactions = pathwayPrediction.heterologous_reactions.map((reactionId) => {
      const metaboliteIds = Object.keys(reactions[reactionId].metabolites);
      return this.mapMnxMetabolitesToBigg(metaboliteIds).pipe(map((ids) => {
        let metabolites_to_add = [];
        let biggMetabolites = {};
        const mnxMetabolites = reactions[reactionId].metabolites;
        for (const mnxId in ids) {
          let metabolite = metabolites[mnxId];
          metabolite.id = ids[mnxId][0];
          metabolites_to_add.push(metabolite);
          biggMetabolites[ids[mnxId][0]] = mnxMetabolites[mnxId];
        }
        return {
          ...reactions[reactionId],
          metabolites: biggMetabolites,
          bigg_id: reactionId,
          metabolites_to_add,
        };
      }));
    });

    if (addedReactions.length === 0) {
      return of([]);
    }

    return forkJoin(addedReactions);
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
    const addedReactions = pathwayPrediction.added_reactions.map((reaction) => Object.assign({
      data: mapBiggReactionToCobra(reaction),
      id: reaction.id,
      operation: 'add',
      type: 'reaction',
    }));
    return [...knockoutReactions, ...knockoutGenes, ...addedReactions];
  }
}
