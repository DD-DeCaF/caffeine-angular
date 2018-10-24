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
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as types from '../../app-interactive-map/types';
import {ModelService} from '../../services/model.service';
import * as fromActions from './models.actions';
import {WarehouseService} from '../../services/warehouse.service';
import {SetError} from './models.actions';
import {Project} from 'src/app/app-models/types';


@Injectable()
export class ModelsEffects {

  @Effect()
  fetchModels: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODELS_MODELS),
    switchMap(() =>
      this.modelService.loadModels()),
    switchMap((models: types.DeCaF.Model[]) => [
      new fromActions.SetModels(models),
      new fromActions.FetchSpecies(),
    ]),
  );

  @Effect()
  fetchSpecies: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_SPECIES_MODELS),
    switchMap(() => this.warehouseService.getOrganisms()),
    map((payload: types.Species[]) => new fromActions.SetSpecies(payload)),
  );

  @Effect()
  fetchModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODEL_MODELS),
    switchMap((action: fromActions.FetchModel) =>
      this.modelService.loadModel(action.payload.id)),
    map((model: types.DeCaF.Model) => new fromActions.SetModel(model)),
  );

  @Effect()
  editModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.EDIT_MODEL_MODELS),
    switchMap((action: fromActions.EditModel) => this.modelService.editModel(action.payload).pipe(
      map((payload: types.DeCaF.Model) => new fromActions.SetModel(payload)),
      catchError(() => of(new SetError())),
    )),
  );

  @Effect()
  removeModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.REMOVE_MODEL_MODELS),
    switchMap((action: fromActions.RemoveModel) => this.modelService.removeModel(action.payload).pipe(
      switchMap((payload: types.DeCaF.Model) => [
        new fromActions.FetchModels(),
        new fromActions.RemovedModel(),
      ]),
      catchError(() => of(new SetError())),
    )),
  );

  @Effect()
  fetchProjectsModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_PROJECTS_MODELS),
    switchMap(() => this.warehouseService.getProjects()),
    map((payload: Project[]) => new fromActions.SetProjectsModels(payload)),
  );

  @Effect()
  addModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ADD_MODEL),
    switchMap((action: fromActions.AddModel) => this.modelService.uploadModel(action.payload).pipe(
      map(() => new fromActions.FetchModels()),
      catchError(() => of(new SetError())),
    )),
  );

  constructor(
    private actions$: Actions,
    private modelService: ModelService,
    private warehouseService: WarehouseService,
  ) {}
}
