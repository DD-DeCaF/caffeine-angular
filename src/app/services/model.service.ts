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
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cobra } from '../app-interactive-map/types';
import * as types from '../app-interactive-map/types';

@Injectable()
export class ModelService {

  constructor(
    private http: HttpClient,
  ) {}

  loadModel(modelId: string): Observable<Cobra.Model> {
    return this.http.get<Cobra.Model>(`${environment.apis.model}/models/${modelId}`);
  }

  loadModels(): Observable <types.DeCaF.Model[]> {
    return this.http.get<types.DeCaF.Model[]>(`${environment.apis.model_warehouse}/models`);
  }
}
