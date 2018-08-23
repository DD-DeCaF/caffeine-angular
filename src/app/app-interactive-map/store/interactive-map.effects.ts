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
import { Action, Store} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import {withLatestFrom, map, mapTo, delay, filter, switchMap, concatMap} from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';

import * as fromActions from './interactive-map.actions';
import { environment } from '../../../environments/environment.staging';

const ACTION_OFFSETS = {
  [fromActions.NEXT_CARD]: 1,
  [fromActions.PREVIOUS_CARD]: -1,
};

@Injectable()
export class InteractiveMapEffects {
  @Effect()
  selectedSpecies: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_SELECTED_SPECIES),
    switchMap((action: fromActions.SetSelectedSpecies) => {
      return this.http.get(`${environment.apis.model}/species/${action.payload}`);
    }),
    map((payload: string[]) => new fromActions.SetModels(payload)),
  );

  @Effect()
  setModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_MODELS),
    switchMap((action: fromActions.SetModel) => {
      return this.http.get(`${environment.apis.map}/model?model=${action.payload[0]}`);
    }),
    concatMap((payload: string[]) => ([
      new fromActions.SetMaps(payload),
      new fromActions.LoadMap(payload[0]),
    ])),
  );

  @Effect()
  loadMap: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOAD_MAP),
    switchMap((action: fromActions.LoadMap) => {
      return this.http.get(`${environment.apis.map}/map?map=${action.payload}`);
    }),
    map((payload: string) => new fromActions.MapLoaded(JSON.parse(payload))),
  );

  // Steps to the previous or the next card depending on the action
  // handles overflow / underflow
  @Effect()
  cardStepper: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.NEXT_CARD, fromActions.PREVIOUS_CARD),
    withLatestFrom(this.store$),
    map(([action, storeState]) => {
      const {interactiveMap} = storeState;
      const {ids} = interactiveMap.cards;
      const {length} = ids;
      const index = ids.findIndex((id) => interactiveMap.selectedCardId === id);

      const newIndex = (length + index + ACTION_OFFSETS[action.type]) % length;
      return new fromActions.SelectCard(ids[newIndex]);
    }),
  );

  // Switch to the next card if play was paused
  @Effect()
  initPlay: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_PLAY_STATE),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    mapTo(new fromActions.NextCard()),
  );

  // This is a fake effect until we implement this in the builder
  // All it does it triggers a loaded action when a new card is selected
  @Effect()
  escherLoaded: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SELECT_CARD),
    delay(2000),
    mapTo(new fromActions.Loaded()),
  );

  // If the card is loaded and playing is enabled, switch to the new one.
  // Perhaps a little delay should be introduced
  @Effect()
  stepNextIfPlaying: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOADED),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    mapTo(new fromActions.NextCard()),
  );

  @Effect()
  operationReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.REACTION_OPERATION, fromActions.SET_OBJECTIVE_REACTION, fromActions.SET_BOUNDS_REACTION),
    // httpRequest here
    // mergeMap((reaction) => {
    //   return this.http.post(`${environment.apis.model}/something here`, reaction);
    // }),
    delay(500),
    withLatestFrom(this.store$),
    map(([action, store]: [fromActions.OperationActions, AppState]) =>
      ({action, cardId: store.interactiveMap.selectedCardId})),
    map(({action, cardId}) => ({
      type: `${action.type}_APPLY`,
      payload: action.payload,
      cardId,
    })),
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private http: HttpClient,
  ) {}
}
