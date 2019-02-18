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
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import * as types from '../app-interactive-map/types';
import {EditModel, AddModel} from 'src/app/app-models/types';

@Injectable()
export class ModelService {

  constructor(
    private http: HttpClient,
  ) {
  }

  loadModel(modelId: number, refresh: boolean = false): Observable<types.DeCaF.Model> {
    const params = new HttpParams().set('refresh', refresh.toString());
    return this.http.get<types.DeCaF.Model>(`${environment.apis.model_storage}/models/${modelId}`,
      {params: params});
  }

  loadModels(refresh: boolean = false): Observable<types.DeCaF.ModelHeader[]> {
    const params = new HttpParams().set('refresh', refresh.toString());
    return this.http.get<types.DeCaF.ModelHeader[]>(`${environment.apis.model_storage}/models`,
      {params: params});
  }

  editModel(modelForm: EditModel): Observable<void> {
    return this.http.put<void>(`${environment.apis.model_storage}/models/${modelForm.id}`, modelForm);
  }

  removeModel(modelId: number): Observable<types.DeCaF.Model> {
    return this.http.delete<types.DeCaF.Model>(`${environment.apis.model_storage}/models/${modelId}`);
  }

  uploadModel(model: AddModel): Observable<types.DeCaF.Model> {
    return this.http.post<types.DeCaF.Model>(`${environment.apis.model_storage}/models`, model);
  }

  getModel(id: string, models: types.DeCaF.ModelHeader[]): types.DeCaF.ModelHeader {
    const emptyModel = <types.DeCaF.ModelHeader>{
      id: null,
      project_id: null,
      name: '',
      organism_id: null,
    };
    if (models.length > 0 && id) {
      const model = models.find((m) => m.id === parseInt(id, 10));
      return model ? model : emptyModel;
    } else {
      return emptyModel;
    }
  }
}
