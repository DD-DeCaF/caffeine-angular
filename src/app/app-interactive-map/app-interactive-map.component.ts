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
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {withLatestFrom} from 'rxjs/operators';
import {select as d3Select} from 'd3';
import * as escher from '@dd-decaf/escher';

import {Cobra, Card} from './types';
import escherSettingsConst from './escherSettings';
import {AppState} from '../store/app.reducers';
import * as fromActions from './store/interactive-map.actions';
import { objectFilter } from '../utils';
import { getSelectedCard } from './store/interactive-map.selectors';
import {FetchSpecies} from './store/interactive-map.actions';
import { selectNotNull } from '../framework-extensions';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LoaderComponent} from './components/loader/loader.component';
import {isLoading} from './components/loader/store/loader.selectors';

const fluxFilter = objectFilter((key, value) => Math.abs(value) > 1e-7);

@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-map.component.scss'],
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
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchSpecies());
    this.store.dispatch(new fromActions.FetchMaps());
    this.store.dispatch(new fromActions.FetchModels());

    const builderObservable = this.builderSubject.asObservable();
    this.store
      .pipe(
        selectNotNull((store) => store.interactiveMap.mapData),
        withLatestFrom(builderObservable),
      ).subscribe(([map, builder]) => {
        this.loading = true;
        builder.load_map(map);
        this.loading = false;
      });

    const selectedCard = this.store
      .pipe(
        selectNotNull(getSelectedCard),
      );

    // Detect changes in model only..
    selectedCard.pipe(
        withLatestFrom(builderObservable),
      ).subscribe(([card, builder]: [Card, escher.BuilderObject]) => {
        this.loading = true;
        builder.load_model(card.model);
        builder.set_reaction_data(fluxFilter(card.solution.flux_distribution));
        builder.set_knockout_reactions(card.knockoutReactions);
        builder._update_data(true, true);
        this.store.dispatch(new fromActions.Loaded());
        this.loading = false;
      });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'loader';

    this.store
      .pipe(
        select(isLoading),
      ).subscribe((loading) => {
        if (loading) {
          this.dialog.open(LoaderComponent, dialogConfig);
        } else {
          this.dialog.closeAll();
        }
    });
  }

  ngAfterViewInit(): void {
    const element = d3Select(this.elRef.nativeElement.querySelector('.escher-builder'));
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
