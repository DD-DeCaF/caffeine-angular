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
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';

import { AppState } from '../../../store/app.reducers';
import { MatSelect, MatSelectChange } from '@angular/material';
import {SetSelectedSpecies, SetModel, SetMap} from '../../store/interactive-map.actions';
import { MapItem } from '../../types';

@Component({
  selector: 'app-global-settings',
  templateUrl: './app-global-settings.component.html',
  styleUrls: ['./app-global-settings.component.scss'],
})
export class AppGlobalSettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('model') modelSelector: MatSelect;
  @ViewChild('map') mapSelector: MatSelect;

  public selectedSpecies: Observable<string>;
  public allSpecies: Observable<{project_id: string, id: string, name: string, created: string, updated: string}[]>;

  public selectedModel: Observable<string>;
  public models: Observable<string[]>;

  public selectedMap: Observable<string>;
  public maps: Observable<MapItem[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {

    this.selectedSpecies = this.store.select((store) => store.interactiveMap.selectedSpecies);
    this.allSpecies = this.store.select((store) => store.interactiveMap.allSpecies);

    this.selectedModel = this.store.select((store) => store.interactiveMap.selectedModel);
    this.models = this.store.select((store) => store.interactiveMap.models);

    this.selectedMap = this.store.select((store) => store.interactiveMap.selectedMap);
    this.maps = this.store.select((store) => store.interactiveMap.maps);
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
        map((change: MatSelectChange): string => change.value),
        withLatestFrom(this.maps),
        map(([selectedName, maps]: [string, MapItem[]]): MapItem =>
          maps.find(({name}) => name === selectedName)),
      )
      .subscribe((mapItem: MapItem) => {
        this.store.dispatch(new SetMap(mapItem));
      });
  }
}
