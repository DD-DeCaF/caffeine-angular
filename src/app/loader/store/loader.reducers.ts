// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as fromLoaderActions from './loader.actions';
import { debug } from '../../logger';


export interface LoaderState {
  loading: boolean;
  count: number;
}

export const initialState: LoaderState = {
  loading: false,
  count: 0,
};

export function loaderReducer(
  state: LoaderState = initialState,
  action: fromLoaderActions.LoaderActions,
): LoaderState {
  debug('Action:', action);
  switch (action.type) {
    case fromLoaderActions.INCREMENT:
      return {
        ...state,
        count: state.count++,
        loading: state.count === 0,
      };
    case fromLoaderActions.DECREMENT:
      return {
        ...state,
        count: state.count--,
        loading: state.count === 0,
      };
      default:
      return state;
  }
}

