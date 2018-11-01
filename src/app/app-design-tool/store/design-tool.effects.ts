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
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {concatMapTo, map, switchMap} from 'rxjs/operators';
import * as fromActions from './design-tool.actions';
import {combineLatest, Observable} from 'rxjs';
import * as types from '../../app-interactive-map/types';
import {ModelService} from '../../services/model.service';
import {WarehouseService} from '../../services/warehouse.service';
import {NinjaService} from '../../services/ninja-service';


@Injectable()
export class DesignToolEffects {

  @Effect()
  initDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.INIT_DESIGN),
    concatMapTo([
      new fromActions.FetchSpeciesDesign(),
      new fromActions.FetchModelsDesign(),
      new fromActions.FetchProductsDesign(),
    ]),
  );

  @Effect()
  fetchSpeciesDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_SPECIES_DESIGN),
    switchMap(() =>
      this.warehouseService.getOrganisms()),
    map((payload: types.Species[]) => new fromActions.SetSpeciesDesign(payload)),
  );

  @Effect()
  setSpeciesDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_SPECIES_DESIGN),
    map((action: fromActions.SetSpeciesDesign) => new fromActions.SetSelectedSpeciesDesign(WarehouseService.preferredSpecies(action.payload))));

  @Effect()
  fetchModelsDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODELS_DESIGN),
    switchMap(() =>
      this.modelService.loadModels()),
    map((models: types.DeCaF.ModelHeader[]) => new fromActions.SetModelsDesign(models)),
  );

  @Effect()
  selectFirstModel: Observable<Action> = combineLatest(
    this.actions$.pipe(ofType(fromActions.FETCH_SPECIES_DESIGN)),
    this.actions$.pipe(ofType(fromActions.SET_SELECTED_SPECIES_DESIGN)),
    this.actions$.pipe(ofType(fromActions.SET_MODELS_DESIGN)),
  ).pipe(
    map(([a, {payload: {id: selectedOrgId}}, {payload: models}]: [never, fromActions.SetSelectedSpeciesDesign, fromActions.SetModelsDesign]) => {
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
    map(() => new fromActions.FetchJobsDesign()));

 /* @Effect()
  fetchJobsDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_PRODUCTS_DESIGN),
    switchMap(() =>
      this.speciesService.loadJobs()),
    map((payload: string[]) => new SetJobsDesign(payload)),
  );*/

  constructor(
    private actions$: Actions,
    private modelService: ModelService,
    private warehouseService: WarehouseService,
    private ninjaService: NinjaService,
  ) {}
}
