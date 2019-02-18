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
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {EditMap} from '../app-maps/types';
import {AddMap} from '../app-maps/store/maps.actions';
import {MapItem} from '../app-interactive-map/types';
import * as types from '../app-interactive-map/types';

@Injectable()
export class MapsService {

  constructor(
    private http: HttpClient,
  ) {}

  loadMaps(refresh: boolean = false): Observable<types.MapItem[]> {
    const params = new HttpParams().set('refresh', refresh.toString());
    return this.http.get<types.MapItem[]>(`${environment.apis.maps}/maps`, {params: params});
  }

  editMap(mapForm: EditMap): Observable <MapItem> {
    return this.http.put<MapItem>(`${environment.apis.maps}/maps/${mapForm.id}`, mapForm);
  }

  removeMap(mapId: number): Observable <MapItem> {
    return this.http.delete<MapItem>(`${environment.apis.maps}/maps/${mapId}`);
  }

  uploadMap(map: AddMap): Observable <AddMap> {
    return this.http.post<AddMap>(`${environment.apis.maps}/maps`, map);
  }
}
