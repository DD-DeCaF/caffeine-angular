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

import * as fromMapsActions from './maps.actions';
import {MapItem} from '../../app-interactive-map/types';

export interface MapsState {
  map: MapItem;
  error: boolean;
  removedMap: boolean;
  loading: boolean;
}

export const initialState: MapsState = {
  map: null,
  error: false,
  removedMap: false,
  loading: true,
};


export function mapsReducer(
  state: MapsState = initialState,
  action: fromMapsActions.MapsActions,
): MapsState {
  switch (action.type) {
    case fromMapsActions.ADD_MAP:
      return {
        ...state,
        loading: true,
      };
    case fromMapsActions.SET_MAP:
      return {
        ...state,
        map: action.payload,
        loading: false,
      };
    case fromMapsActions.SET_ERROR_MAP:
      return {
        ...state,
        error: true,
        loading: false,
      };
    case fromMapsActions.RESET_ERROR_MAP:
      return {
        ...state,
        error: false,
      };
    case fromMapsActions.REMOVED_MAP:
      return {
        ...state,
        removedMap: true,
      };
    case fromMapsActions.RESET_REMOVED_MAP:
      return {
        ...state,
        error: false,
        removedMap: false,
      };
    default:
      return state;
  }
}
