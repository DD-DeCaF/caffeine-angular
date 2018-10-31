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
import { debug } from '../../../../logger';


export interface LoaderState {
  count: number;
  loadingError: boolean;
  loading: boolean;
}

export const initialState: LoaderState = {
  count: 0,
  loadingError: false,
  loading: false,
};

export function loaderReducer(
  state: LoaderState = initialState,
  action: fromLoaderActions.LoaderActions,
): LoaderState {
  debug('Action:', action);
  switch (action.type) {
    case fromLoaderActions.LOADING:
      return {
        ...state,
        loading: true,
      };
    case fromLoaderActions.LOADING_FINISHED:
      return {
        ...state,
        loading: false,
      };
    case fromLoaderActions.LOADING_ERROR:
      return {
        ...state,
        loadingError: true,
        loading: false,
      };
    default:
      return state;
  }
}

