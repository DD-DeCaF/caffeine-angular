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

import * as fromDesingToolActions from './design-tool.actions';
import * as types from '../../app-interactive-map/types';
import * as typesDesign from '../types';

export interface DesignToolState {
  selectedSpecies: types.Species;
  selectedModel: types.DeCaF.ModelHeader;
  products: typesDesign.Product[];
  designStarted: boolean;
  jobs: string[];
  lastJobId: string;
}

export const initialState: DesignToolState = {
  selectedSpecies: null,
  selectedModel: null,
  products: [],
  designStarted: false,
  jobs: null,
  lastJobId: null,
};


export function designToolReducer(
  state: DesignToolState = initialState,
  action: fromDesingToolActions.DesignToolActions,
): DesignToolState {
  switch (action.type) {
    case fromDesingToolActions.SET_SELECTED_SPECIES_DESIGN:
      return {
        ...state,
        selectedSpecies: action.payload,
      };
    case fromDesingToolActions.SET_PRODUCTS_DESIGN:
      return {
        ...state,
        products: action.payload,
      };
    case fromDesingToolActions.START_DESIGN:
      return {
        ...state,
        designStarted: true,
      };
    case fromDesingToolActions.SET_LAST_JOB_DESIGN:
      return {
        ...state,
        lastJobId: action.payload.id,
      };
    default:
      return state;
  }
}
