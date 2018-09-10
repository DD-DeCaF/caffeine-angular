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
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

import { Job } from './types';


@Injectable()
export class JobService {
  constructor() {}

  getJobs(): Observable<Job[]> {
    const fixtures$ = Observable.create((observer) => {
        observer.next([{
            id: 1,
            started: new Date("2018-09-10T16:24:06"),
            completed: new Date("2018-09-10T18:11:41"),
            state: "completed",
            type: "Pathway prediction",
            organism: "Some organism?",
            product: "itaconate",
            model: "iJO1366",
            numberOfPathways: 10,
        }, {
            id: 2,
            started: new Date("2018-09-10T16:24:06"),
            completed: new Date("2018-09-10T18:11:41"),
            state: "errored",
            type: "Pathway prediction",
            organism: "Some organism?",
            product: "globoside",
            model: "iMM904",
            numberOfPathways: 10,
            error: "KeyError: Unknown model 'iMM904'",
        }, {
            id: 3,
            started: new Date("2018-09-10T16:24:06"),
            completed: new Date("2018-09-10T18:11:41"),
            state: "completed",
            type: "Pathway prediction",
            organism: "Some organism?",
            product: "selenophosphate",
            model: "iJO1366",
            numberOfPathways: 10,
        }, {
            id: 4,
            started: new Date("2018-09-10T16:24:06"),
            completed: null,
            state: "running",
            type: "Pathway prediction",
            organism: "Some organism?",
            product: "5'-hydroxyomeprazole",
            model: "iJO1366",
            numberOfPathways: 10,
        }, {
            id: 5,
            started: new Date("2018-09-10T16:24:06"),
            completed: null,
            state: "running",
            type: "Pathway prediction",
            organism: "Some organism?",
            product: "alpha-carotene",
            model: "iJO1366",
            numberOfPathways: 10,
        }]);
    });
    return fixtures$;

    // TODO:
    // return this.http.get<Job[]>(`${environment.apis.job}/jobs`);
  }
}
