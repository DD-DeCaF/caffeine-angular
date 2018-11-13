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

import {Component, OnDestroy, OnInit} from '@angular/core';

import { Job } from '../../types';
import {Observable, Subscription} from 'rxjs';
import { Store, select } from '@ngrx/store';
import {map} from 'rxjs/operators';
import { timer } from 'rxjs';
import { AppState } from '../../../store/app.reducers';
import {FetchJobs} from '../../../store/shared.actions';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: Observable<Job[]>;
  polling: Subscription;
  // isLoading = true;
  // loadError = false;
  displayedColumns: string[] = ['id', 'type', 'product', 'state', 'details'];

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    let jobsFinished = true;
    this.polling = timer(0, 20000)
      .subscribe(() => {
        this.store.dispatch(new FetchJobs());
        this.jobs = this.store.pipe(
          select((state) => state.shared.jobs),
          map((jobs) => {
            for (let i = 0; i < jobs.length; i++) {
              if (jobs[i].state === 'STARTED' || jobs[i].state === 'PENDING') {
                jobsFinished = false;
                continue;
              }
            }
            if (jobsFinished) {
              this.polling.unsubscribe();
            }
            return jobs;
          }),
        );
      });
  }

  ngOnDestroy(): void {
    this.polling.unsubscribe();
  }
}
