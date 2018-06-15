import * as SessionActions from './session.actions';

export interface SessionState {
  authenticated: boolean;
}

const initialState: SessionState = {
  authenticated: false,
};

export function sessionReducer(state = initialState, action) {
  switch ( action.type) {
    // case (SessionActions.SIGNUP):
    case (SessionActions.SIGNIN):
      return {
        ...state,
        authenticated: true,
      };
    case (SessionActions.LOGOUT):
      return {
        ...state,
        authenticated: false,
      };
  }
  return state;
}
