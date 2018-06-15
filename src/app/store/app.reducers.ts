import {ActionReducerMap} from '@ngrx/store';

import {SessionState, sessionReducer} from '../session/store/session.reducers';

export interface AppState {
  session: SessionState;
}

export const reducers: ActionReducerMap<AppState> = {
  session: sessionReducer,
};
