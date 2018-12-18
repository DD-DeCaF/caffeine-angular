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
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';
import * as typesDesign from '../../app-design-tool/types';
import {map} from 'rxjs/operators';
import {HydratedCard} from '../types';

@Injectable()
export class DesignService {
  constructor(
    private http: HttpClient,
  ) {}

  saveDesign(design: HydratedCard): Observable<HydratedCard> {
    console.log('DESIGN', design);
    return this.http.post<HydratedCard>(`${environment.apis.metabolic_ninja}/design`, design);
  }
}
