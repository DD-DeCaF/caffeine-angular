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

import {Component, AfterViewInit, ElementRef, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {filter, withLatestFrom} from 'rxjs/operators';
import {select} from 'd3';
import * as escher from '@dd-decaf/escher';

import {Cobra} from './types';
import escherSettingsConst from './escherSettings';
import {AppState} from '../store/app.reducers';
import * as fromActions from './store/interactive-map.actions';
import { notNull } from '../utils';
import { getSelectedCard } from './store/interactive-map.selectors';


@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-mapcomponent.scss'],
})
export class AppInteractiveMapComponent implements OnInit, AfterViewInit {
  private builderSubject = new Subject<escher.BuilderObject>();
  public map: Observable<escher.PathwayMap>;
  public model: Observable<Cobra.Model>;
  public loading = true;

  readonly escherSettings = {
    ...escherSettingsConst,
    tooltip_callbacks: {
      knockout: (args) => { this.handleKnockout(args); },
      setAsObjective: (args) => { this.handleSetAsObjective(args); },
      changeBounds: (args) => { this.handleChangeBounds(args); },
      resetBounds: (args) => { this.handleResetBounds(args); },
      objectiveDirection: (args) => { this.handleObjectiveDirection(args); },
    },
  };
  constructor(
    private elRef: ElementRef,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetSelectedSpecies('ECOLX'));

    const builderObservable = this.builderSubject.asObservable();
    this.store
      .select((store) => store.interactiveMap.mapData)
      .pipe(
        filter(notNull),
        withLatestFrom(builderObservable),
      ).subscribe(([map, builder]) => {
        this.loading = true;
        builder.load_map(map);
        this.loading = false;
      });

    const selectedCard = this.store
      .select(getSelectedCard)
      .pipe(
        filter(notNull),
      );

    // Detect changes in model only..
    selectedCard.pipe(
        withLatestFrom(builderObservable),
      ).subscribe(([card, builder]) => {
        this.loading = true;
        builder.load_model(card.model);
        if (card.flux) {
          builder.set_reaction_data(card.flux);
        }
        this.store.dispatch(new fromActions.Loaded());
        this.loading = false;
      });
  }

  ngAfterViewInit(): void {
    const element = select(this.elRef.nativeElement.querySelector('.escher-builder'));
    this.builderSubject.next(
      escher.Builder(
        null,
        null,
        null,
        element,
        this.escherSettings,
      ),
    );
  }

  handleKnockout(args: string): void {
    console.log('KNOCKOUT', args);
  }

  handleSetAsObjective(args: string): void {
    console.log('SET AS OBJECTIVE', args);
  }

  handleChangeBounds(args: string): void {
    console.log('CHANGE BOUNDS', args);
  }

  handleResetBounds(args: string): void {
    console.log('RESET BOUNDS', args);
  }

  handleObjectiveDirection(args: string): void {
    console.log('OBJECTIVE DIRECTION', args);
  }
}
