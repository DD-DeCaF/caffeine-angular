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

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

import { AppState } from '../../../store/app.reducers';
import { MatSelect, MatSelectChange } from '@angular/material';
import { SetSelectedSpecies, SetModel, SetMap } from '../../store/interactive-map.actions';
import { mapItemsByModel, activeModels } from '../../store/interactive-map.selectors';
import * as types from '../../types';

@Component({
  selector: 'app-global-settings',
  templateUrl: './app-global-settings.component.html',
  styleUrls: ['./app-global-settings.component.scss'],
})
export class AppGlobalSettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('model') modelSelector: MatSelect;
  @ViewChild('map') mapSelector: MatSelect;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;

  public selectedModelHeader: Observable<types.DeCaF.ModelHeader>;
  public activeModelHeaders: Observable<types.DeCaF.ModelHeader[]>;

  public selectedMap: Observable<types.MapItem>;
  public mapItems: Observable<{
    modelIds: string[],
    mapsByModelId: {[key: string]: types.MapItem[] },
  }>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectedSpecies = this.store.pipe(select((store) => store.interactiveMap.selectedSpecies));
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));

    this.selectedModelHeader = this.store.pipe(select((store) => store.interactiveMap.selectedModelHeader));
    this.activeModelHeaders = this.store.pipe(select(activeModels));

    this.selectedMap = this.store.pipe(select((store) => store.interactiveMap.selectedMap));
    this.mapItems = this.store.pipe(select(mapItemsByModel));
  }

  ngAfterViewInit(): void {
    this.speciesSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.store.dispatch(new SetSelectedSpecies(change.value));
      });

    this.modelSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.store.dispatch(new SetModel(change.value));
      });

    this.mapSelector.selectionChange
      .pipe(
        map((change: MatSelectChange): types.MapItem => change.value),
      )
      .subscribe((mapItem: types.MapItem) => {
        this.store.dispatch(new SetMap(mapItem));
      });
  }
}
