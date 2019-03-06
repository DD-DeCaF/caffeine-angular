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

import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Store, select } from '@ngrx/store';

import { Job } from '../../types';
import { Subscription, Observable, timer } from 'rxjs';
import { AppState } from '../../../store/app.reducers';
import { SessionState } from '../../../session/store/session.reducers';
import { FetchJobs } from '../../../store/shared.actions';
import {getOrganismName, getModelName} from '../../../store/shared.selectors';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<Job>([]);
  public polling: Subscription;
  public sessionState$: Observable<SessionState>;
  public jobs: Subscription;

  // isLoading = true;
  // loadError = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['product_name', 'organism_id', 'model_id', 'status', 'created', 'details'];

  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
  ) {}

  getOrganismNameById(organismId: number): Observable<string> {
    return this.store.pipe(
      select(getOrganismName(organismId)));
  }

  getModelNameById(modelId: number): Observable<string> {
    return this.store.pipe(
      select(getModelName(modelId)));
  }

  ngOnInit(): void {
    let jobsFinished = true;
    this.polling = timer(0, 20000)
      .subscribe(() => {
        this.store.dispatch(new FetchJobs());
        this.jobs = this.store.pipe(select((state) => state.shared.jobs))
          .subscribe((jobs) => {
            for (let i = 0; i < jobs.length; i++) {
              if (jobs[i].state === 'STARTED' || jobs[i].state === 'PENDING') {
                jobsFinished = false;
                continue;
              }
            }
            if (jobsFinished) {
              this.polling.unsubscribe();
            }
            this.dataSource.data = jobs;
            this.cdr.detectChanges();
          });
      });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sessionState$ = this.store.select('session');
  }

  ngOnDestroy(): void {
    this.polling.unsubscribe();
    if (this.jobs) {
      this.jobs.unsubscribe();
    }
  }
}
