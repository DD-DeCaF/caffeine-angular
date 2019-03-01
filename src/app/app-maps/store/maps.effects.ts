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
import {catchError, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as fromActions from './maps.actions';
import {SetError} from './maps.actions';
import * as sharedActions from '../../store/shared.actions';
import {MapsService} from '../../services/maps.service';
import * as loaderActions from '../../app-interactive-map/components/loader/store/loader.actions';


@Injectable()
export class MapsEffects {

  @Effect()
  editMap: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.EDIT_MAP),
    switchMap((action: fromActions.EditMap) => this.mapsService.editMap(action.payload).pipe(
      switchMap(() => [
        new sharedActions.FetchMaps(),
        new loaderActions.LoadingFinished(),
      ]),
      catchError(() => of(new SetError())),
    )),
  );

  @Effect()
  removeMap: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.REMOVE_MAP),
    switchMap((action: fromActions.RemoveMap) => this.mapsService.removeMap(action.payload).pipe(
      switchMap(() => [
        new sharedActions.FetchMaps(),
        new fromActions.RemovedMap(),
      ]),
      catchError(() => of(new SetError())),
    )),
  );

  @Effect()
  addMap: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ADD_MAP),
    switchMap((action: fromActions.AddMap) => this.mapsService.uploadMap(action.payload).pipe(
      switchMap(() => [
        new sharedActions.FetchMaps(),
        new loaderActions.LoadingFinished(),
      ]),
      catchError(() => of(new SetError())),
    )),
  );

  constructor(
    private actions$: Actions,
    private mapsService: MapsService,
  ) {}
}
