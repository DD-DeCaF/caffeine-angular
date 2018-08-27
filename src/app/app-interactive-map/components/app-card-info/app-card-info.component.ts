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

import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatSelect, MatSelectChange, MatInput } from '@angular/material';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppState} from '../../../store/app.reducers';
import {getSelectedCard} from '../../store/interactive-map.selectors';
import { HydratedCard, Method } from '../../types';
import { SetMethod, RenameCard } from '../../store/interactive-map.actions';

@Component({
  selector: 'app-card-info',
  templateUrl: './app-card-info.component.html',
  styleUrls: ['./app-card-info.component.scss'],
})
export class AppCardInfoComponent implements OnInit {
  @ViewChild('method') method: MatSelect;
  @ViewChild('name') name: ElementRef;

  public card: Observable<HydratedCard>;

  public methods: Method[] = [
    { id: 'fba', name: 'Flux Balance Analysis (FBA)' },
    { id: 'pfba', name: 'Parsimonious FBA' },
    { id: 'fva', name: 'Flux Variability Analysis (FVA)' },
    { id: 'pfba-fva', name: 'Parsimonious FVA' },
  ];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.card = this.store.pipe(
      select(getSelectedCard));

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
