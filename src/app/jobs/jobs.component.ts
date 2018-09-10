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

import {Component, OnInit, ViewChild} from '@angular/core';

import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

import {JobService} from './jobs.service';
import { Job } from './types';


@Component({
  selector: 'jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  jobService: JobService | null;
  jobs: Job[] | null = [];

  isLoading = true;
  loadError = false;
  displayedColumns: string[] = ['id', 'name'];

  constructor() {}

  ngOnInit() {
    this.jobService = new JobService();
    this.jobService.getJobs().subscribe(
      (jobs: Job[]) => {
        this.isLoading = false;
        this.loadError = false;
        this.jobs = jobs;
      },
      (error: string) => {
        this.isLoading = false;
        this.loadError = true;
      },
    );
  }
}