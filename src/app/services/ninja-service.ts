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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import * as typesDesign from '../app-design-tool/types';
import {map} from 'rxjs/operators';
import {Job, PathwayResponse, PathwayPredictionResult} from '../jobs/types';
import {DeCaF} from '../app-interactive-map/types';

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
    return this.http.get<Job[]>(`${environment.apis.metabolic_ninja}/predictions`).pipe(map((predictions: Job[]) =>
      this.processPredictions(predictions)));
  }

  processPredictions(predictions: Job[]): Job[] {
    for (let i = 0; i < predictions.length; i++) {
      this.http.get(`${environment.apis.model_storage}/models/${ predictions[i].model_id}`).subscribe((model: DeCaF.Model) => {
          predictions[i].model = model;
        });
    }
    return predictions;
  }

  getOperations(pathwayPrediction: PathwayPredictionResult): DeCaF.Operation[] {
    if (pathwayPrediction.method === 'PathwayPredictor+OptGene') {
      return pathwayPrediction.knockouts.map((gene) => Object.assign({
        data: null,
        id: gene,
        operation: 'knockout',
        type: 'gene',
      }));
    }
    return pathwayPrediction.knockouts.map((reaction) => Object.assign({
      data: null,
      id: reaction,
      operation: 'knockout',
      type: 'reaction',
    }));
  }
}
