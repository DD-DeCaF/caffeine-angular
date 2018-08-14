// ./effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { Action , Store} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, map, mapTo, delay, filter } from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';

import { SELECT_CARD, NEXT_CARD, PREVIOUS_CARD, TOGGLE_PLAY, LOADED } from './interactive-map.actions';

const ACTION_OFFSETS = {
  [NEXT_CARD]: 1,
  [PREVIOUS_CARD]: -1,
};

@Injectable()
export class InteractiveMapEffects {
  // Steps to the previous or the next card depending on the action
  // handles overflow / underflow
  @Effect()
  cardStepper: Observable<Action> = this.actions$.pipe(
    ofType(NEXT_CARD, PREVIOUS_CARD),
    withLatestFrom(this.store$),
    map(([action, storeState]) => {
      const interactiveMap = storeState.interactiveMap;
      const length = interactiveMap.cards.ids.length;
      const index = interactiveMap.cards.ids
        .findIndex((id) => interactiveMap.selectedCardId === id);

      const newIndex = (length + index + ACTION_OFFSETS[action.type]) % length;
      return {
        type: SELECT_CARD,
        payload: interactiveMap.cards.ids[newIndex],
      };
    }),
  );

  // Switch to the next card if play was paused
  @Effect()
  initPlay: Observable<Action> = this.actions$.pipe(
    ofType(TOGGLE_PLAY),
    withLatestFrom(this.store$),
    filter(([action, storeState]) => storeState.interactiveMap.playing),
    mapTo({type: NEXT_CARD}),
  );

  // This is a fake effect until we implement this in the builder
  // All it does it triggers a loaded action when a new card is selected
  @Effect()
  escherLoaded: Observable<Action> = this.actions$.pipe(
    ofType(SELECT_CARD),
    delay(2000),
    mapTo({type: LOADED}),
  );

  // If the card is loaded and playing is enabled, switch to the new one.
  // Perhaps a little delay should be introduced
  @Effect()
  stepNextIfPlaying: Observable<Action> = this.actions$.pipe(
    ofType(LOADED),
    withLatestFrom(this.store$),
    filter(([action, storeState]) => storeState.interactiveMap.playing),
    mapTo({type: NEXT_CARD}),
  );

  constructor(private actions$: Actions, private store$: Store<AppState>) {}
}
