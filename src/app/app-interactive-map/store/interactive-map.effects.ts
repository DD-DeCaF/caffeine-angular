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
import { Action, Store, select} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Observable, combineLatest, of} from 'rxjs';
import {withLatestFrom, map, mapTo, delay, filter, switchMap, concatMapTo, take, catchError} from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';

import * as fromActions from './interactive-map.actions';
import { environment } from '../../../environments/environment.staging';
import * as types from '../types';
import { PathwayMap } from '@dd-decaf/escher';
import {interactiveMapReducer} from './interactive-map.reducers';
import { SimulationService } from '../services/simulation.service';
import { MapService } from '../services/map.service';
import { WarehouseService } from '../../services/warehouse.service';
import {mapBiggReactionToCobra} from '../../utils';
import * as sharedActions from '../../store/shared.actions';
import * as loaderActions from '../components/loader/store/loader.actions';


const ACTION_OFFSETS = {
  [fromActions.NEXT_CARD]: 1,
  [fromActions.PREVIOUS_CARD]: -1,
};

@Injectable()
export class InteractiveMapEffects {

  @Effect()
  setSpecies: Observable<Action> = this.actions$.pipe(
    ofType(sharedActions.SET_SPECIES),
    map((action: sharedActions.SetSpecies) =>
      new fromActions.SetSelectedSpecies(WarehouseService.preferredSpecies(action.payload))));

  @Effect()
  selectFirstModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SELECT_FIRST_MODEL_MAP),
    map((payload: fromActions.SelectFirstModel) => {
      const selectedModelHeader = payload.models
        .find((model) => model.organism_id === payload.species.id);
      return new fromActions.SetModel(selectedModelHeader);
    }),
  );

  @Effect()
  setMaps: Observable<Action> = combineLatest(
    this.actions$.pipe(
      ofType(fromActions.SET_MODEL)),
    this.actions$.pipe(
      ofType(sharedActions.SET_MAPS),
      take(1),
    ),
  ).pipe(
    map(([action]) => action),
    withLatestFrom(this.store$),
    map(([action, storeState]: [fromActions.SetModel, AppState]) => {
      const model = action.payload;
      const {maps} = storeState.shared;
      const mapSelector = MapService.createMapSelector(model);
      return new fromActions.SetMap(mapSelector(maps));
    }),
  );

  @Effect()
  resetCards: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_FULL_MODEL),
    concatMapTo([
      new fromActions.ResetCards(),
      new fromActions.AddCard(types.CardType.WildType),
    ]),
  );

   @Effect()
  fetchFullModel: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_MODEL),
    switchMap((action: fromActions.SetFullModel) =>
      this.http.get(`${environment.apis.model_storage}/models/${action.payload.id}`)),
    map((model: types.DeCaF.Model) => new fromActions.SetFullModel(model)),
  );

  @Effect()
  simulateNewCard: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ADD_CARD),
    withLatestFrom(this.store$.pipe(select((store) => store.interactiveMap.selectedModelHeader))),
    switchMap(([{payload: type}, model]: [fromActions.AddCard, types.DeCaF.Model]) => {
      const payload: types.SimulateRequest = {
        model_id: model.id,
        method: 'pfba',
        objective: null,
        objective_direction: null,
        operations: [],
      };
      return this.simulationService.simulate(payload)
        .pipe(
          map((solution) => ({
            type,
            solution,
          })),
          map((data) => new fromActions.AddCardFetched(data)),
          catchError(() => of(new loaderActions.LoadingError())),
        );
    }),
  );

  @Effect()
  fetchMap: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_MAP),
    switchMap((action: fromActions.SetMap) => {
      return this
        .http.get(`${environment.apis.maps}/maps/${action.payload.id}`)
        .pipe(map((response: PathwayMap) => ({
          mapData: response,
          mapItem: action.payload,
        })),
          map(({mapData, mapItem}) => new fromActions.MapFetched({mapData, mapItem})),
          catchError(() => of(new loaderActions.LoadingError())),
      );
    }),
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

  // If the card is loaded and playing is enabled, switch to the new one.
  // Perhaps a little delay should be introduced
  @Effect()
  stepNextIfPlaying: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOADED),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    delay(700),
    mapTo(new fromActions.NextCard()),
  );

  @Effect()
  operationReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_METHOD, fromActions.REACTION_OPERATION, fromActions.SET_OBJECTIVE_REACTION),
    withLatestFrom(this.store$),
    switchMap(([action, store]: [fromActions.OperationAction, AppState]) => {
      // Ugly hack not to implement the reduction twice.
      // @ts-ignore
      const newAction = new fromActions.operationToApply[action.type](action.payload);
      const IMStore = interactiveMapReducer(store.interactiveMap, newAction);
      const selectedCard = IMStore.cards.cardsById[IMStore.selectedCardId];

      const addedReactions = selectedCard.addedReactions.map((reaction: types.AddedReaction): types.DeCaF.Operation => ({
        operation: 'add',
        type: 'reaction',
        id: reaction.bigg_id,
        data: mapBiggReactionToCobra(reaction),
      }));

      const knockouts = selectedCard.knockoutReactions.map((reactionId: string): types.DeCaF.Operation => ({
        operation: 'knockout',
        type: 'reaction',
        id: reactionId,
        data: null,
      }));

      const bounds = selectedCard.bounds.map(({reaction, lowerBound, upperBound}: types.Bound): types.DeCaF.Operation => ({
        operation: 'modify',
        type: 'reaction',
        id: reaction.id,
        data: {
          ...reaction,
          lower_bound: lowerBound,
          upper_bound: upperBound,
        },
      }));

      const payload: types.SimulateRequest = {
        model_id: store.interactiveMap.selectedModelHeader.id,
        method: selectedCard.method,
        objective_direction: selectedCard.objectiveReaction ? selectedCard.objectiveReaction.direction : null,
        objective: selectedCard.objectiveReaction ? selectedCard.objectiveReaction.reactionId : null,
        operations: [
          ...addedReactions,
          ...knockouts,
          ...bounds,
        ],
      };
      return this.simulationService.simulate(payload)
        .pipe(map((solution: types.DeCaF.Solution) => ({
          action: newAction,
          solution,
        })),
          /* tslint:disable */
          map(({action, solution}) => ({
            ...action,
            solution,
          })),
          /* tslint:enable */
          catchError(() => of(new loaderActions.LoadingError())),
          );
    }),
  );

   @Effect()
  loadingRequest: Observable<Action> = this.actions$.pipe(
    ofType(sharedActions.FETCH_SPECIES, sharedActions.FETCH_MODELS, sharedActions.FETCH_MAPS, fromActions.ADD_CARD, fromActions.REACTION_OPERATION,
      fromActions.SET_OBJECTIVE_REACTION),
    mapTo(new loaderActions.Loading()),
  );

  @Effect()
  loadingFinishedRequest: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOADED),
    mapTo(new loaderActions.LoadingFinished()),
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private http: HttpClient,
    private simulationService: SimulationService,
  ) {}
}
