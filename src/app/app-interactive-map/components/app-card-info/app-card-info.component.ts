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

import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppState} from '../../../store/app.reducers';
import {activeModels, activeModelsCard, getSelectedCard} from '../../store/interactive-map.selectors';
import { HydratedCard, Method } from '../../types';
import {SetMethod, RenameCard, ChangeSelectedSpecies, ChangeSelectedModel} from '../../store/interactive-map.actions';
import { selectNotNull } from '../../../framework-extensions';
import * as types from '../../types';

@Component({
  selector: 'app-card-info',
  templateUrl: './app-card-info.component.html',
  styleUrls: ['./app-card-info.component.scss'],
})
export class AppCardInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('method') method: MatSelect;
  @ViewChild('name') name: ElementRef;
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('modelSelector') modelsSelector: MatSelect;

  public card: Observable<HydratedCard>;
  public allSpecies: Observable<types.Species[]>;
  public models: Observable<types.DeCaF.ModelHeader[]>;

  public methods: Method[] = [
    { id: 'fba', name: 'Flux Balance Analysis (FBA)' },
    { id: 'pfba', name: 'Parsimonious FBA' },
    { id: 'fva', name: 'Flux Variability Analysis (FVA)' },
    { id: 'pfba-fva', name: 'Parsimonious FVA' },
  ];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.models = this.store.pipe(select(activeModelsCard));

    this.card = this.store.pipe(
      selectNotNull(getSelectedCard));
  }

  ngAfterViewInit(): void {
    this.speciesSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.store.dispatch(new ChangeSelectedSpecies(change.value));
      });

    this.modelsSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        console.log('CHNAGE VALUE', change);
        this.store.dispatch(new ChangeSelectedModel(change.value));
      });

    this.method.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.store.dispatch(new SetMethod(change.value));
      });
  }

  nameBlur(): void {
    this.store.dispatch(new RenameCard(this.name.nativeElement.value));
  }

  onKeyEnter(): void {
    this.store.dispatch(new RenameCard(this.name.nativeElement.value));
    this.method.focus();
  }
}
