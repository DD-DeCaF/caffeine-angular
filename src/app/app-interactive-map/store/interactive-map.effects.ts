import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action, Store} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import {withLatestFrom, map, mapTo, delay, filter, mergeMap} from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';

import * as fromActions from './interactive-map.actions';
import {environment} from '../../../environments/environment';

const ACTION_OFFSETS = {
  [fromActions.NEXT_CARD]: 1,
  [fromActions.PREVIOUS_CARD]: -1,
};

@Injectable()
export class InteractiveMapEffects {
  // Steps to the previous or the next card depending on the action
  // handles overflow / underflow
  @Effect()
  cardStepper: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.NEXT_CARD, fromActions.PREVIOUS_CARD),
    withLatestFrom(this.store$),
    map(([action, storeState]) => {
      const interactiveMap = storeState.interactiveMap;
      const length = interactiveMap.cards.ids.length;
      const index = interactiveMap.cards.ids
        .findIndex((id) => interactiveMap.selectedCardId === id);

      const newIndex = (length + index + ACTION_OFFSETS[action.type]) % length;
      return {
        type: fromActions.SELECT_CARD,
        payload: interactiveMap.cards.ids[newIndex],
      };
    }),
  );

  // Switch to the next card if play was paused
  @Effect()
  initPlay: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.TOGGLE_PLAY),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    mapTo({type: fromActions.NEXT_CARD}),
  );

  // This is a fake effect until we implement this in the builder
  // All it does it triggers a loaded action when a new card is selected
  @Effect()
  escherLoaded: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SELECT_CARD),
    delay(2000),
    mapTo({type: fromActions.LOADED}),
  );

  // If the card is loaded and playing is enabled, switch to the new one.
  // Perhaps a little delay should be introduced
  @Effect()
  stepNextIfPlaying: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOADED),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    mapTo({type: fromActions.NEXT_CARD}),
  );

  @Effect()
  operationReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.OPERATION_REACTION),
    mergeMap((reaction) => {
      return this.http.post(`${environment.apis.model}/something here`, reaction)
        .pipe(
          map((data) => ({ type: fromActions.OPERATION_REACTION, payload: data })),
        );
    }),
  );

  @Effect()
  knockoutReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.KNOCKOUT_REACTION),
    mergeMap((reaction) => {
      return this.http.post(`${environment.apis.model}/something here`, reaction)
        .pipe(
          map((data) => ({ type: fromActions.KNOCKOUT_REACTION, payload: data })),
        );
    }),
  );

  @Effect()
  setObjectiveReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SETOBJECTIVE_REACTION),
    mergeMap((reaction) => {
      return this.http.post(`${environment.apis.model}/something here`, reaction)
        .pipe(
          map((data) => ({ type: fromActions.SETOBJECTIVE_REACTION, payload: data })),
        );
    }),
  );

  @Effect()
  setBoundsReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SETBOUNDS_REACTION),
    mergeMap((reaction) => {
      return this.http.post(`${environment.apis.model}/something here`, reaction)
        .pipe(
          map((data) => ({ type: fromActions.SETBOUNDS_REACTION, payload: data })),
        );
    }),
  );

  constructor(private actions$: Actions, private store$: Store<AppState>, private http: HttpClient) {}
}
