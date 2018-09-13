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

import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { JobsService } from '../jobs.service';

import * as fromJobsActions from './jobs.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Job } from '../types';

@Injectable()
export class JobsEffects {
  @Effect()
  fetchJobs: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsActions.FETCH_JOBS),
    switchMap(() =>
      this.jobsService.getJobs().pipe(
        map((jobs: Job[]) => new fromJobsActions.FetchJobsSuccess(jobs)),
        catchError(() => of(new fromJobsActions.FetchJobsFailed())),
      )),
  );

  constructor(
    private actions$: Actions,
    private jobsService: JobsService,
  ) {}
}
