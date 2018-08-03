import {ActionReducerMap} from '@ngrx/store';

import {SessionState, sessionReducer} from '../session/store/session.reducers';
import {InteractiveMapState, interactiveMapReducer} from '../app-interactive-map/store/interactive-map.reducers';

export interface AppState {
  session: SessionState;
  interactiveMap: InteractiveMapState;
}

export const reducers: ActionReducerMap<AppState> = {
  session: sessionReducer,
  interactiveMap: interactiveMapReducer,
};
