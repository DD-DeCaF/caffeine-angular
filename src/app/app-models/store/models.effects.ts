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
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as types from '../../app-interactive-map/types';
import {ModelService} from '../../services/model.service';
import * as fromActions from './models.actions';


@Injectable()
export class ModelsEffects {

  @Effect()
  fetchModels: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODELS_MODELS),
    switchMap(() =>
      this.modelService.loadModels()),
    map((models: types.DeCaF.Model[]) => new fromActions.SetModelsModels(models)),
  );

  constructor(
    private actions$: Actions,
    private modelService: ModelService,
  ) {}
}