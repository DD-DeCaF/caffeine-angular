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
<<<<<<< HEAD
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HydratedCard } from '../../types';
import { AppState } from '../../../store/app.reducers';
import { getSelectedCard } from '../../store/interactive-map.selectors';
=======
import {getSelectedCard, HydratedCard} from '../../store/interactive-map.selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {Observable} from 'rxjs';
>>>>>>> feat: added input card inside components.

@Component({
  selector: 'app-reaction',
  templateUrl: './app-reaction.component.html',
})
export class AppReactionComponent implements OnInit {
<<<<<<< HEAD
  public card: Observable<HydratedCard>;

  constructor(public store: Store<AppState>) {}

  ngOnInit(): void {
    this.card = this.store.pipe(select(getSelectedCard));
=======

  public card: Observable<HydratedCard>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.card = this.store.pipe(
      select(getSelectedCard));
>>>>>>> feat: added input card inside components.
  }
}
