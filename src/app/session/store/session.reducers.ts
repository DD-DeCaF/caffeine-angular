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

import * as SessionActions from './session.actions';

export interface SessionState {
  authenticated: boolean;
}

const initialState: SessionState = {
  authenticated: false,
};

export function sessionReducer(
  state: SessionState = initialState,
  action: SessionActions.Sessionctions,
): SessionState {
  switch (action.type) {
    // case (SessionActions.SIGNUP):
    case (SessionActions.LOGIN):
      return {
        ...state,
        authenticated: true,
      };
    case (SessionActions.LOGOUT):
      return {
        ...state,
        authenticated: false,
      };
    default:
      return state;
  }
}
