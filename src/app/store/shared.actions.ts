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


export const FETCH_MODELS = 'FETCH_MODELS';
export const FETCH_MODELS_UPLOAD = 'FETCH_MODELS_UPLOAD';
export const SET_MODELS = 'SET_MODELS';
export const SET_MODELS_UPLOAD = 'SET_MODELS_UPLOAD';
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

export class FetchModels implements Action {
  readonly type = FETCH_MODELS;
}

export class SetModels implements Action {
  readonly type = SET_MODELS;
  constructor(public payload: types.DeCaF.ModelHeader[]) {}
}

export class FetchModelsUpload implements Action {
  readonly type = FETCH_MODELS_UPLOAD;
}

export class SetModelsUpload implements Action {
  readonly type = SET_MODELS_UPLOAD;
  constructor(public payload: types.DeCaF.ModelHeader[]) {}
}

export class FetchSpecies implements Action {
  readonly type = FETCH_SPECIES;
}

export class SetSpecies implements Action {
  readonly type = SET_SPECIES;
  constructor(public payload: types.Species[]) {}
}

export class FetchProjects implements Action {
  readonly type = FETCH_PROJECTS;
}

export class SetProjects implements Action {
  readonly type = SET_PROJECTS;
  constructor(public payload: projectTypes.Project[]) {}
}

export class FetchMaps implements Action {
  readonly type = FETCH_MAPS;
}

export class SetMaps implements Action {
  readonly type = SET_MAPS;
  constructor(public payload: types.MapItem[]) {}
}

export class FetchJobs implements Action {
  readonly type = FETCH_JOBS;
}

export class SetJobs implements Action {
  readonly type = SET_JOBS;
  constructor(public payload: Job[]) {}
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

export type SharedActions = FetchModels | SetModels | FetchSpecies | SetSpecies | FetchModel | FetchProjects | SetProjects | FetchMaps | SetMaps | FetchJobs |
  SetJobs | SetModelsError | SetSpeciesError | SetProjectsError | SetMapsError | SetJobsError | FetchModelsUpload | SetModelsUpload;
