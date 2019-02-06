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
import { Observable } from 'rxjs';

import { Job, IdMapperResponse } from './types';
import { NinjaService } from '../services/ninja-service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class JobsService {
  constructor(public ninjaService: NinjaService, private http: HttpClient) { }

  getJobs(): Observable<Job[]> {
    return this.ninjaService.getPredictions();
  }

  // mapMetabolitesToBiggIds(metaboliteIds): Observable<Object> {
  //   const body = {"ids": metaboliteIds, "dbFrom": "mnx", "dbTo": "bigg", "type": "Metabolite"}
  //   return this.http.post<IdMapperResponse>(`${environment.apis.id_mapper}`, body).pipe(map((response: IdMapperResponse) => {
  //     let ids = Object.values(response.ids);
  //     let result = [];
  //     for (let id of ids) {
  //       result.push(id[0]);
  //     }
  //     return result
  //   }))
  // }
}
