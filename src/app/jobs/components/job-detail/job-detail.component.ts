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
import { ActivatedRoute } from '@angular/router';

import {Job, PathwayPredictionReactions, PathwayPredictionResult, PathwayResponse} from '../../types';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';
import { getJob } from '../../store/jobs.selectors';
import { selectNotNull } from '../../../framework-extensions';

import { map } from 'rxjs/operators';
import {NinjaService} from '../../../services/ninja-service';


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit {
  job$: Observable<Job>;
  loadError = false;
  // @ts-ignore
  public tableData: PathwayPredictionResult[];
  public reactionsData: PathwayPredictionReactions[];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private ninjaService: NinjaService,
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.params.id;
    console.log('JOB ID', jobId);
    this.job$ = this.store.pipe(
      selectNotNull(getJob, {jobId}),
      map((a) => {
        this.ninjaService.getPredict(jobId).subscribe((jobPrediction: PathwayResponse) => {
          if (jobPrediction.result) {
          this.tableData = jobPrediction.result.table || [];
          this.reactionsData = jobPrediction.result.reactions || [];
        }
          const jobs = JSON.parse(localStorage.getItem('jobs'));
          const jobIndex = jobs.findIndex(((job) => job.id === parseInt(jobId, 10)));
          jobs[jobIndex].state = jobPrediction.status;
          localStorage.setItem('jobs', JSON.stringify(jobs));
        });
        return a;
      }),
    );
    // this.jobSservice.getJobs().subscribe(
    //   (jobs: Job[]) => {
    //     this.job = jobs.filter((job) => job.id === Number(this.route.snapshot.params['id']))[0];
    //   },
    //   (error: string) => {
    //     this.loadError = true;
    //   },
    // );
  }

  public abort(job: Job): void {
    // TODO: use mat-dialog https://material.angular.io/components/dialog/overview
    if (!confirm(`Are you sure you wish to abort job ${job.id}: ${job.data.type}?`)) {
      return;
    }
    job.state = 'REVOKED';
    job.completed = new Date();
    console.log(`Cancel job: ${job.id}`);
  }
}
