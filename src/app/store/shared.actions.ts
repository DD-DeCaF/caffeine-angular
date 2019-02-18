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

import {Action} from '@ngrx/store';
import * as types from '../app-interactive-map/types';
import {FetchModel} from '../app-models/store/models.actions';
import * as projectTypes from '../projects/types';
import {Job} from '../jobs/types';
import {DesignRequest} from '../app-designs/types';
import {Experiment} from '../app-interactive-map/types';


export const FETCH_MODELS = 'FETCH_MODELS';
export const SET_MODELS = 'SET_MODELS';
export const SET_SELECTED_PROJECT = 'SET_SELECTED_PROJECT';
export const SET_MODELS_ERROR = 'SET_MODELS_ERROR';
export const FETCH_SPECIES = 'FETCH_SPECIES';
export const SET_SPECIES = 'SET_SPECIES';
export const SET_SPECIES_ERROR = 'SET_SPECIES_ERROR';
export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const SET_PROJECTS = 'SET_PROJECTS';
export const SET_PROJECTS_ERROR = 'SET_PROJECTS_ERROR';
export const FETCH_MAPS = 'FETCH_MAPS';
export const SET_MAPS = 'SET_MAPS';
export const SET_MAPS_ERROR = 'SET_MAPS_ERROR';
export const FETCH_JOBS = 'FETCH_JOBS';
export const SET_JOBS = 'SET_JOBS';
export const SET_JOBS_ERROR = 'SET_JOBS_ERROR';
export const FETCH_DESIGNS = 'FETCH_DESIGNS';
export const SET_DESIGNS = 'SET_DESIGNS';
export const SET_DESIGNS_ERROR = 'SET_DESIGNS_ERROR';
export const FETCH_EXPERIMENTS = 'FETCH_EXPERIMENTS';
export const SET_EXPERIMENTS = 'SET_EXPERIMENTS';

export class FetchModels implements Action {
  readonly type = FETCH_MODELS;
  constructor(public refresh: boolean = false) {
  }
}

export class SetModels implements Action {
  readonly type = SET_MODELS;

  constructor(public payload: types.DeCaF.ModelHeader[]) {
  }
}

export class FetchSpecies implements Action {
  readonly type = FETCH_SPECIES;
}

export class SetSpecies implements Action {
  readonly type = SET_SPECIES;

  constructor(public payload: types.Species[]) {
  }
}

export class FetchProjects implements Action {
  readonly type = FETCH_PROJECTS;
  constructor(public refresh: boolean = false) {
  }
}

export class SetProjects implements Action {
  readonly type = SET_PROJECTS;

  constructor(public payload: projectTypes.Project[]) {
  }
}

export class FetchMaps implements Action {
  readonly type = FETCH_MAPS;
  constructor(public refresh: boolean = false) {
  }
}

export class SetMaps implements Action {
  readonly type = SET_MAPS;

  constructor(public payload: types.MapItem[]) {
  }
}

export class FetchJobs implements Action {
  readonly type = FETCH_JOBS;
  constructor(public refresh: boolean = false) {
  }
}

export class SetJobs implements Action {
  readonly type = SET_JOBS;

  constructor(public payload: Job[]) {
  }
}

export class FetchExperiments implements Action {
  readonly type = FETCH_EXPERIMENTS;
}

export class SetExperiments implements Action {
  readonly type = SET_EXPERIMENTS;

  constructor(public payload: Experiment[]) {
  }
}

export class SetModelsError implements Action {
  readonly type = SET_MODELS_ERROR;
}

export class SetSpeciesError implements Action {
  readonly type = SET_SPECIES_ERROR;
}

export class SetProjectsError implements Action {
  readonly type = SET_PROJECTS_ERROR;
}

export class SetMapsError implements Action {
  readonly type = SET_MAPS_ERROR;
}

export class SetJobsError implements Action {
  readonly type = SET_JOBS_ERROR;
}

export class FetchDesigns implements Action {
  readonly type = FETCH_DESIGNS;
  constructor(public refresh: boolean = false) {
  }
}

export class SetDesigns implements Action {
  readonly type = SET_DESIGNS;

  constructor(public payload: DesignRequest[]) {
  }
}

export class SetDesignsError implements Action {
  readonly type = SET_DESIGNS_ERROR;
}

export class SetSelectedProject implements Action {
  readonly type = SET_SELECTED_PROJECT;

  constructor(public payload: projectTypes.Project) {
  }
}


export type SharedActions =
  FetchModels
  | SetModels
  | FetchSpecies
  | SetSpecies
  | FetchModel
  | FetchProjects
  | SetProjects
  | FetchMaps
  | SetMaps
  | FetchJobs
  | SetJobs
  | SetModelsError
  | SetSpeciesError
  | SetProjectsError
  | SetMapsError
  | SetJobsError
  | FetchDesigns
  | SetDesigns
  | SetDesignsError
  | SetSelectedProject
  | FetchExperiments
  | SetExperiments;
