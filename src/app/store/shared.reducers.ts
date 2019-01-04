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

import * as fromModelsActions from './shared.actions';
import * as types from '../app-interactive-map/types';
import {Project} from 'src/app/projects/types';
import {Job} from 'src/app/jobs/types';
import {Design} from '../app-design-tool/types';
import {DesignRequest} from '../app-designs/types';

export interface SharedState {
  allSpecies: types.Species[];
  maps: types.MapItem[];
  modelHeaders: types.DeCaF.ModelHeader[];
  projects: Project[];
  jobs: Job[];
  designs: DesignRequest[];
  speciesError: boolean;
  mapsError: boolean;
  modelsError: boolean;
  projectsError: boolean;
  jobsError: boolean;
  designsError: boolean;
}

export const initialState: SharedState = {
  allSpecies: [],
  maps: [],
  projects: [],
  modelHeaders: [],
  jobs: [],
  designs: [],
  speciesError: false,
  mapsError: false,
  modelsError: false,
  projectsError: false,
  jobsError: false,
  designsError: false,
};


export function sharedReducer(
  state: SharedState = initialState,
  action: fromModelsActions.SharedActions,
): SharedState {
  switch (action.type) {
    case fromModelsActions.SET_MODELS:
      return {
        ...state,
        modelHeaders: action.payload,
      };
    case fromModelsActions.SET_MODELS_ERROR:
      return {
        ...state,
        modelsError: true,
      };
    case fromModelsActions.SET_SPECIES:
      return {
        ...state,
        allSpecies: action.payload,
      };
    case fromModelsActions.SET_SPECIES_ERROR:
      return {
        ...state,
        speciesError: true,
      };
    case fromModelsActions.SET_MAPS:
      return {
        ...state,
        maps: action.payload,
      };
    case fromModelsActions.SET_MAPS_ERROR:
      return {
        ...state,
        mapsError: true,
      };
    case fromModelsActions.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      };
    case fromModelsActions.SET_PROJECTS_ERROR:
      return {
        ...state,
        projectsError: true,
      };
    case fromModelsActions.SET_JOBS:
      return {
        ...state,
        jobs: action.payload,
      };
    case fromModelsActions.SET_JOBS_ERROR:
      return {
        ...state,
        jobsError: true,
      };
    case fromModelsActions.SET_DESIGNS_ERROR:
      return {
        ...state,
        designsError: true,
      };
    case fromModelsActions.SET_DESIGNS:
      return {
        ...state,
        designs: action.payload,
      };
    default:
      return state;
  }
}
