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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {JobService} from './jobs.service';
import {Job} from './types';


@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  job: Job;
  loaded = false;
  loadError = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    new JobService().getJobs().subscribe(
      (jobs: Job[]) => {
        this.job = jobs.filter((job) => job.id === Number(this.route.snapshot.params['id']))[0];
      },
      (error: string) => {
        this.loadError = true;
      },
    );
  }

  public abort(job: Job): void {
    // TODO: use mat-dialog https://material.angular.io/components/dialog/overview
    if (!confirm(`Are you sure you wish to abort job ${job.id}: ${job.data.type}?`)) {
      return;
    }
    job.state = 'aborted';
    job.completed = new Date();
    console.log(`Cancel job: ${job.id}`);
  }
}
