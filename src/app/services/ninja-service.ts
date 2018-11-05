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
import { Cobra } from '../app-interactive-map/types';
import * as typesDesign from '../app-design-tool/types';

@Injectable()
export class NinjaService {

  constructor(
    private http: HttpClient,
  ) {}

  postPredict(design: typesDesign.Design): Observable<typesDesign.StatePrediction> {
    const desingPredict = {
      model_name: design.model.name,
      product_name: design.product.name,
      project_id: design.project_id || null,
      ...design,
    };
    return this.http.post<typesDesign.StatePrediction>(`${environment.apis.metabolic_ninja}/predict`, desingPredict);
  }


  getPredict(task_id: number): Observable<typesDesign.StatePrediction> {
    return this.http.get<typesDesign.StatePrediction>(`${environment.apis.warehouse}/predict/${task_id}`);
  }
}
