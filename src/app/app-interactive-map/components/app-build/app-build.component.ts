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
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import {SelectCard, NextCard, PreviousCard, TogglePlay, AddCard, DeleteCard} from '../../store/interactive-map.actions';
import * as fromInteractiveMapSelectors from '../../store/interactive-map.selectors';

import { AppState } from '../../../store/app.reducers';
import { CardType } from '../../types';

@Component({
  selector: 'app-build',
  templateUrl: './app-build.component.html',
  styleUrls: ['./app-build.component.scss'],
})
export class AppBuildComponent implements OnInit {
  interactiveMapState: Observable<AppState>;
  public cards: Observable<fromInteractiveMapSelectors.HydratedCard[]>;
  public playing: Observable<boolean>;

  public expandedCard: fromInteractiveMapSelectors.HydratedCard = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.cards = this.store.pipe(select(fromInteractiveMapSelectors.getHydratedCards));
    this.playing = this.store.pipe(select((state: AppState) => state.interactiveMap.playing));
  }

  public select(card: fromInteractiveMapSelectors.HydratedCard): void {
    this.store.dispatch(new SelectCard(card.id));
  }

  public addWildtypeCard(): void {
    this.store.dispatch(new AddCard(CardType.WildType));
  }

  public addDataDrivenCard(): void {
    this.store.dispatch(new AddCard(CardType.DataDriven));
  }

  public next(): void {
    this.store.dispatch(new NextCard());
  }

  public togglePlay(): void {
    this.store.dispatch(new TogglePlay());
  }

  public previous(): void {
    this.store.dispatch(new PreviousCard());
  }

  public delete(card: fromInteractiveMapSelectors.HydratedCard): void {
    this.store.dispatch(new DeleteCard(card.id));
  }

  public grow(card: fromInteractiveMapSelectors.HydratedCard): void {
    this.store.dispatch(new SelectCard(card.id));
    this.expandedCard = card;
  }

  public shrink(): void {
    this.expandedCard = null;
  }
}
