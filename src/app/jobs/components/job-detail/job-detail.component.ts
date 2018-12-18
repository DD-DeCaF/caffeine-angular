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
import {ActivatedRoute} from '@angular/router';

import {Job, PathwayPredictionReactions, PathwayPredictionResult, PathwayResponse} from '../../types';
import {Observable, Subscription, timer} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {getJob} from '../../store/jobs.selectors';
import {selectNotNull} from '../../../framework-extensions';

import {map} from 'rxjs/operators';
import {NinjaService} from '../../../services/ninja-service';
import {getModelName, getOrganismName} from '../../../store/shared.selectors';


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit, OnDestroy {
  job$: Observable<Job>;
  model: Observable<string>;
  organism: Observable<string>;
  loadError = false;
  // @ts-ignore
  public tableData: PathwayPredictionResult[];
  public reactionsData: PathwayPredictionReactions[];
  public cofactorSwap = false;
  polling: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private ninjaService: NinjaService,
  ) {
  }

  ngOnInit(): void {
    this.polling = timer(0, 20000)
      .subscribe(() => {
        const jobId = this.route.snapshot.params.id;
        this.job$ = this.store.pipe(
          selectNotNull(getJob, {jobId}),
          map((j) => {
            this.ninjaService.getPredict(jobId).subscribe((jobPrediction: PathwayResponse) => {
              this.model = this.store.pipe(
                select(getModelName(jobPrediction.model_id)));
              this.organism = this.store.pipe(
                select(getOrganismName(jobPrediction.organism_id)));
              if (jobPrediction.result) {
                if (jobPrediction.result.table[0].method === 'PathwayPredictor+CofactorSwap') {
                  this.cofactorSwap = true;
                }
                this.tableData = jobPrediction.result.table || [];
                this.reactionsData = jobPrediction.result.reactions || [];
                this.polling.unsubscribe();
              } else if (jobPrediction.status === 'FAILURE') {
                this.polling.unsubscribe();
              }
            });
            return j;
          }),
        );
      });
  }

  public abort(job: Job): void {
    // TODO: use mat-dialog https://material.angular.io/components/dialog/overview
    if (!confirm(`Are you sure you wish to abort job ${job.id}: ${job.data.type}?`)) {
      return;
    }
    console.log(`Cancel job: ${job.id}`);
  }

  ngOnDestroy(): void {
    this.polling.unsubscribe();
  }
}
