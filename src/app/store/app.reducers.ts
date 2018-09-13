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

import {ActionReducerMap} from '@ngrx/store';

import {SessionState, sessionReducer} from '../session/store/session.reducers';
import {InteractiveMapState, interactiveMapReducer} from '../app-interactive-map/store/interactive-map.reducers';
import {JobsState, jobsReducer} from '../jobs/store/jobs.reducers';

export interface AppState {
  session: SessionState;
  interactiveMap: InteractiveMapState;
  jobs: JobsState;
}

export const reducers: ActionReducerMap<AppState> = {
  session: sessionReducer,
  interactiveMap: interactiveMapReducer,
  jobs: jobsReducer,
};

export const initialState: AppState = Object.assign(
  {},
  ...Object.entries(([key, reducer]) => ({
    [key]: reducer(),
  })),
);
