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
import { Observable, from, of } from 'rxjs';

import { Job, PathwayResponse } from './types';
import { concatMap, map } from 'rxjs/operators';
import { NinjaService } from '../services/ninja-service';

@Injectable()
export class JobsService {
  constructor(public ninjaService: NinjaService) { }

  getJobs(): Observable<Job[]> {
    return from([
      JSON.parse(localStorage.getItem('jobs')) || [],
    ])
      .pipe(
        map((jobs) => this.checkJobs(jobs)),
        concatMap((x) => of(x),
        ),
    );
  }

  checkJobs(jobs: Job[]): Job[] {
    const jobsLocalStorage = <Job[]>JSON.parse(localStorage.getItem('jobs'));
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].state !== 'REVOKED') {
        this.ninjaService.getPredict(jobs[i].id).subscribe((jobPrediction: PathwayResponse) => {
          const jobIndex = jobsLocalStorage.findIndex(((job) => job.id === jobs[i].id));
          jobs[jobIndex].state = jobPrediction.status;
          if (jobPrediction.status === 'SUCCESS') {
            jobs[jobIndex].completed = jobs[jobIndex].completed || new Date();
          }
          localStorage.setItem('jobs', JSON.stringify(jobs));
        });
      }
    }
    return jobs;

  }
}
