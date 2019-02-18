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
import {HttpClient, HttpParams} from '@angular/common/http';
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

  getPredictions(refresh: boolean = false): Observable<Job[]> {
    const params = new HttpParams().set('refresh', refresh.toString());
    return this.http.get<Job[]>(`${environment.apis.metabolic_ninja}/predictions`, {params: params}).pipe(switchMap((predictions: Job[]) => {
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
      pipe(map((response) => response['ids']));
  }

  getAddedReactions(
    pathwayPrediction: PathwayPredictionResult,
    reactions: PathwayPredictionReactions,
    metabolites: PathwayPredictionMetabolites): Observable<AddedReaction[]> {
    const heterologousReactions = pathwayPrediction.heterologous_reactions.map((reactionId) => {
      const metaboliteIds = Object.keys(reactions[reactionId].metabolites);
      return this.mapMnxMetabolitesToBigg(metaboliteIds).pipe(map((ids) => {
        const metabolites_to_add = [];
        const biggMetabolites = {};
        const mnxMetabolites = reactions[reactionId].metabolites;
          for (const mnxId in ids) {
            if (mnxId) {
              const biggId = ids[mnxId][0] + '_c';
              const metabolite = metabolites[mnxId];
              metabolite.id = biggId;
              metabolites_to_add.push(metabolite);
              biggMetabolites[biggId] = mnxMetabolites[mnxId];
            }
          }
        return {
          ...reactions[reactionId],
          metabolites: biggMetabolites,
          id: reactionId,
          bigg_id: reactionId,
          metabolites_to_add,
        };
      }));
    });

    const syntheticReactions = pathwayPrediction.synthetic_reactions.map((reactionId: string) => {
      const mnxMetabolite = reactionId.slice(3);
      return this.mapMnxMetabolitesToBigg([mnxMetabolite]).pipe(map((ids) => {
        const biggId = ids[mnxMetabolite][0] + '_c';
        const metabolite_to_add = {
          name: biggId,
          id: biggId,
          annotation: {},
          charge: -1,
          compartment: 'c',
          formula: biggId,
        };
        return {
          id: reactionId,
          name: reactionId,
          bigg_id: reactionId,
          metabolites: {[biggId]: -1},
          metabolites_to_add: [metabolite_to_add],
          lower_bound: 0,
          upper_bound: 1000,
        };
      }));
    });

    const addedReactions = [...heterologousReactions, ...syntheticReactions];

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
