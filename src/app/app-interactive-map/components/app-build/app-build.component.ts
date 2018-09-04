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

import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import { MatButton } from '@angular/material';
import {Store, select} from '@ngrx/store';
import {Observable, fromEvent} from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import {SelectCard, NextCard, PreviousCard, SetPlayState, AddCard, DeleteCard} from '../../store/interactive-map.actions';
import * as fromInteractiveMapSelectors from '../../store/interactive-map.selectors';

import { AppState } from '../../../store/app.reducers';
import { CardType, HydratedCard } from '../../types';

@Component({
  selector: 'app-build',
  templateUrl: './app-build.component.html',
  styleUrls: ['./app-build.component.scss'],
})
export class AppBuildComponent implements OnInit, AfterViewInit {
  @ViewChild('play') playButton: MatButton;

  interactiveMapState: Observable<AppState>;
  public cards: Observable<HydratedCard[]>;
  public playing: Observable<boolean>;

  public expandedCard: HydratedCard = null;
  public tabIndex: number = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.cards = this.store.pipe(select(fromInteractiveMapSelectors.getHydratedCards));
    this.playing = this.store.pipe(select((state: AppState) => state.interactiveMap.playing));
  }

  ngAfterViewInit(): void {
    fromEvent(this.playButton._elementRef.nativeElement, 'click').pipe(
      withLatestFrom(this.playing),
    ).subscribe(([, playing]) => {
      this.store.dispatch(new SetPlayState(!playing));
    });
  }

  public select(card: HydratedCard): void {
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

  public previous(): void {
    this.store.dispatch(new PreviousCard());
  }

  public delete(card: HydratedCard): void {
    this.store.dispatch(new DeleteCard(card.id));
  }

  public grow(card: HydratedCard, tabIndex: number): void {
    this.store.dispatch(new SetPlayState(false));
    this.store.dispatch(new SelectCard(card.id));
    this.expandedCard = card;
    this.tabIndex = tabIndex;
  }

  public shrink(): void {
    this.expandedCard = null;
  }

  private growthRateMeaningful(growthRate: number): boolean {
    return Math.abs(growthRate) > 1e-05;
  }

  public growthRateBackground(growthRate: number): string {
    return this.growthRateMeaningful(growthRate) ? 'white' : '#FEEFB3';
  }

  public formatGrowthRate(growthRate: number): string {
    return this.growthRateMeaningful(growthRate) ?
      growthRate.toPrecision(3) :
      '0';
  }
}
