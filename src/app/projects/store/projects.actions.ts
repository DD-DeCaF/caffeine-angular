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

import {Project} from '../types';

export const FETCH_PROJECTS = '[Projects] Trigger HTTP query to fetch projects';
export const SET_PROJECTS = '[Projects] Set received projects in state';
export const CREATE_PROJECT = '[Projects] Create new project';

export class FetchProjects implements Action {
  readonly type = FETCH_PROJECTS;
}

export class SetProjects implements Action {
  readonly type = SET_PROJECTS;
  constructor(public payload: Project[]) {}
}

export class CreateProject implements Action {
  readonly type = CREATE_PROJECT;
  constructor(public payload: Project) {}
}

export type ProjectActions = FetchProjects | SetProjects;
