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

import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {concatMapTo, map, switchMap} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import * as actions from './projects.actions';
import * as types from '../types';

@Injectable()
export class ProjectsEffects {

  @Effect()
  fetchSpeciesDesign: Observable<Action> = this.actions$.pipe(
    ofType(actions.FETCH_PROJECTS),
    switchMap(() => this.http.get<types.Project[]>(`${environment.apis.iam}/projects`)),
    map((payload: types.Project[]) => new actions.SetProjects(payload)),
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) {}
}
