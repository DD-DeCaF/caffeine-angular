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

import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {concatMapTo, map, switchMap} from 'rxjs/operators';
import * as fromActions from './design-tool.actions';
import {combineLatest, Observable} from 'rxjs';
import * as types from '../../app-interactive-map/types';
import {WarehouseService} from '../../services/warehouse.service';
import * as sharedActions from '../../store/shared.actions';
import {NinjaService} from '../../services/ninja-service';
import {StatePrediction} from '../types';
import {SetLastJobDesign} from './design-tool.actions';
import {Router} from '@angular/router';


@Injectable()
export class DesignToolEffects {

  @Effect()
  initDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.INIT_DESIGN),
    concatMapTo([
      new sharedActions.FetchSpecies(),
      new sharedActions.FetchModels(),
      new fromActions.FetchProductsDesign(),
    ]),
  );

  @Effect()
  setSpeciesDesign: Observable<Action> = this.actions$.pipe(
    ofType(sharedActions.SET_SPECIES),
    map((action: sharedActions.SetSpecies) => new fromActions.SetSelectedSpeciesDesign(WarehouseService.preferredSpecies(action.payload))));

  @Effect()
  selectFirstModel: Observable<Action> = combineLatest(
    this.actions$.pipe(ofType(sharedActions.FETCH_SPECIES)),
    this.actions$.pipe(ofType(fromActions.SET_SELECTED_SPECIES_DESIGN)),
    this.actions$.pipe(ofType(sharedActions.SET_MODELS)),
  ).pipe(
    map(([a, {payload: {id: selectedOrgId}}, {payload: models}]: [never, fromActions.SetSelectedSpeciesDesign, sharedActions.SetModels]) => {
      const selectedModel = models
        .filter((model) => model.organism_id === selectedOrgId.toString())[0];
      return new fromActions.SetModelDesign(selectedModel);
    }),
  );

  @Effect()
  fetchProductsDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_PRODUCTS_DESIGN),
    switchMap(() =>
      this.warehouseService.getProducts()),
    map((payload: types.Species[]) => new fromActions.SetProductsDesign(payload)),
  );

  @Effect()
  startDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.START_DESIGN),
    switchMap((action: fromActions.StartDesign) =>
      this.ninjaService.postPredict(action.payload)),
    map((payload: StatePrediction) => {
      const jobs = JSON.parse(localStorage.getItem('jobs'));
      if (jobs) {
        jobs.push({
          id: payload.id,
          started: new Date(),
          completed: null,
          state: payload.status,
          data: {
            type: 'Pathway prediction',
            ...payload.configuration,
          },
        });
        localStorage.setItem('jobs', JSON.stringify(jobs));
      } else {
        localStorage.setItem('jobs', JSON.stringify([{
          id: payload.id,
          started: new Date(),
          completed: null,
          state: payload.status,
          data: {
            type: 'Pathway prediction',
            ...payload.configuration,
          },
        }]));
      }
      this.router.navigateByUrl(`/jobs/${payload.id}`);
      return new SetLastJobDesign(payload);
    }));

  @Effect()
  setLastJobDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_LAST_JOB_DESIGN),
    map(() => {
      return new sharedActions.FetchJobs();
    }),
  );

  /* @Effect()
   fetchJobsDesign: Observable<Action> = this.actions$.pipe(
     ofType(fromActions.FETCH_PRODUCTS_DESIGN),
     switchMap(() =>
       this.speciesService.loadJobs()),
     map((payload: string[]) => new SetJobsDesign(payload)),
   );*/

  constructor(
    private actions$: Actions,
    private warehouseService: WarehouseService,
    private ninjaService: NinjaService,
    private router: Router,
  ) {
  }
}
