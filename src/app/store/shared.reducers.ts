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

import * as fromSharedActions from './shared.actions';
import * as types from '../app-interactive-map/types';
import {Project} from 'src/app/projects/types';
import {Job} from 'src/app/jobs/types';
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
  selectedProject: Project;
  experiments: types.Experiment[];
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
  selectedProject: null,
  experiments: [],
};


export function sharedReducer(
  state: SharedState = initialState,
  action: fromSharedActions.SharedActions,
): SharedState {
  switch (action.type) {
    case fromSharedActions.SET_MODELS:
      return {
        ...state,
        modelHeaders: action.payload,
      };
    case fromSharedActions.SET_MODELS_ERROR:
      return {
        ...state,
        modelsError: true,
      };
    case fromSharedActions.SET_SPECIES:
      return {
        ...state,
        allSpecies: action.payload,
      };
    case fromSharedActions.SET_SPECIES_ERROR:
      return {
        ...state,
        speciesError: true,
      };
    case fromSharedActions.SET_MAPS:
      return {
        ...state,
        maps: action.payload,
      };
    case fromSharedActions.SET_MAPS_ERROR:
      return {
        ...state,
        mapsError: true,
      };
    case fromSharedActions.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      };
    case fromSharedActions.SET_PROJECTS_ERROR:
      return {
        ...state,
        projectsError: true,
      };
    case fromSharedActions.SET_JOBS:
      return {
        ...state,
        jobs: action.payload,
      };
    case fromSharedActions.SET_JOBS_ERROR:
      return {
        ...state,
        jobsError: true,
      };
    case fromSharedActions.SET_DESIGNS_ERROR:
      return {
        ...state,
        designsError: true,
      };
    case fromSharedActions.SET_DESIGNS:
      return {
        ...state,
        designs: action.payload,
      };
    case fromSharedActions.SET_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: action.payload,
      };
    case fromSharedActions.SET_EXPERIMENTS:
      return {
        ...state,
        experiments: action.payload,
      };
    default:
      return state;
  }
}
