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

import { Component, OnInit } from '@angular/core';

import { Job } from '../../types';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AppState } from '../../../store/app.reducers';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit {
  jobs: Observable<Job[]>;

  // isLoading = true;
  // loadError = false;
  displayedColumns: string[] = ['id', 'type', 'product', 'state', 'details'];

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.jobs = this.store.pipe(
      select((state) => state.jobs.jobs),
      map((jobs) => {
        console.log(jobs);
        return jobs;
      }),
    );
  }
}
