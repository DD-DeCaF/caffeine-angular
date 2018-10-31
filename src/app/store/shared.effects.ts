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
import {HttpClient} from '@angular/common/http';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import {environment} from '../../environments/environment';
import * as types from '../app-interactive-map/types';
import {ModelService} from '../services/model.service';
import * as fromActions from './shared.actions';
import {WarehouseService} from '../services/warehouse.service';
import {Project} from 'src/app/projects/types';
import {JobsService} from '../jobs/jobs.service';
import {MapService} from '../app-interactive-map/services/map.service';
import {Job} from 'src/app/jobs/types';


@Injectable()
export class SharedEffects {

  @Effect()
  fetchModels: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODELS),
    switchMap(() => this.modelService.loadModels().pipe(
      switchMap((models: types.DeCaF.Model[]) => [
        new fromActions.SetModels(models),
        new fromActions.FetchSpecies(),
      ]),
      catchError(() => of(new fromActions.SetModelsError())),
    )),
  );

  @Effect()
  fetchSpecies: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_SPECIES),
    switchMap(() => this.warehouseService.getOrganisms().pipe(
      map((payload: types.Species[]) => new fromActions.SetSpecies(payload)),
      catchError(() => of(new fromActions.SetSpeciesError())),
    )),
  );


  @Effect()
  fetchProjects: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_PROJECTS),
    switchMap(() => this.http.get<Project[]>(`${environment.apis.iam}/projects`).pipe(
      map((payload: Project[]) => new fromActions.SetProjects(payload)),
      catchError(() => of(new fromActions.SetProjectsError())),
    )),
  );

  @Effect()
  fetchMaps: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MAPS),
    switchMap(() =>
      this.mapService.loadMaps().pipe(
        map((maps: types.MapItem[]) => new fromActions.SetMaps(maps)),
        catchError(() => of(new fromActions.SetMapsError())),
      )),
  );

  @Effect()
  fetchJobs: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_JOBS),
    switchMap(() =>
      this.jobsService.getJobs().pipe(
        map((jobs: Job[]) => new fromActions.SetJobs(jobs)),
        catchError(() => of(new fromActions.SetJobsError())),
      )),
  );

  constructor(
    private actions$: Actions,
    private modelService: ModelService,
    private warehouseService: WarehouseService,
    private jobsService: JobsService,
    private mapService: MapService,
    private http: HttpClient,
  ) {}
}
