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

import { Action } from '@ngrx/store';
import { Job } from '../types';

export const FETCH_JOBS = 'FETCH_JOBS';
export const FETCH_JOBS_SUCCESS = 'FETCH_JOBS_SUCCESS';
export const FETCH_JOBS_FAILED = 'FETCH_JOBS_FAILED';

export class FetchJobs implements Action {
  readonly type = FETCH_JOBS;
}

export class FetchJobsSuccess implements Action {
  readonly type = FETCH_JOBS_SUCCESS;
  constructor(public payload: Job[]) {}
}

export class FetchJobsFailed implements Action {
  readonly type = FETCH_JOBS_FAILED;
}

export type JobsActions = FetchJobs | FetchJobsSuccess | FetchJobsFailed;
