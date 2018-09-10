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
import {map, switchMap} from 'rxjs/operators';
import * as fromActions from './design-tool.actions';
import {Observable} from 'rxjs';
import * as types from '../../app-interactive-map/types';
import {SpeciesService} from '../../services/species.service';
import {ModelService} from '../../services/model.service';
import {
  FetchJobsDesign,
  SetJobsDesign,
  SetModelsDesign,
  SetProductsDesign,
  SetSelectedSpeciesDesign,
  SetSpeciesDesign,
  StartDesign
} from './design-tool.actions';

const preferredSpeciesList = [
  'Escherichia coli',
];

const preferredSelector = <T>(
  predicate: (item: T) => boolean,
  preferredMap?: (item: T) => boolean,
) => (items: T[]): T =>
  items.find(predicate) || (preferredMap ? items.find(preferredMap) || items[0] : items[0]);


const preferredSpecies = preferredSelector((species: types.Species) =>
  preferredSpeciesList.includes(species.name));

@Injectable()
export class DesignToolEffects {
  @Effect()
  fetchSpeciesDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_SPECIES_DESIGN),
    switchMap(() =>
      this.speciesService.loadSpecies()),
    map((payload: types.Species[]) => new SetSpeciesDesign(payload)),
  );

  @Effect()
  setSpeciesDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_SPECIES_DESIGN),
    map((action: fromActions.SetSpeciesDesign) => new SetSelectedSpeciesDesign(preferredSpecies(action.payload))));

  @Effect()
  fetchModelsDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODELS_DESIGN),
    switchMap(() =>
      this.modelService.loadModels()),
    map((models: types.DeCaF.Model[]) => new SetModelsDesign(models)),
  );

  @Effect()
  fetchProductsDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_PRODUCTS_DESIGN),
    switchMap(() =>
      this.speciesService.loadProducts()),
    map((payload: types.Species[]) => new SetProductsDesign(payload)),
  );

  @Effect()
  startDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.START_DESIGN),
    map(() => new FetchJobsDesign()));

  @Effect()
  fetchJobsDesign: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_PRODUCTS_DESIGN),
    switchMap(() =>
      this.speciesService.loadJobs()),
    map((payload: string[]) => new SetJobsDesign(payload)),
  );

 /* @Effect()
  abortJobDesign: Observable<string> = this.actions$.pipe(
    ofType(fromActions.FETCH_PRODUCTS_DESIGN),
    switchMap((action) =>
      this.speciesService.abortJob(action.payload)),
  );*/

  constructor(
    private actions$: Actions,
    private modelService: ModelService,
    private speciesService: SpeciesService,
  ) {}
}
