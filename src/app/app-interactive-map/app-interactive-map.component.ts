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
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {withLatestFrom} from 'rxjs/operators';
import {select as d3Select} from 'd3';
import * as escher from '@dd-decaf/escher';

import {Card, OperationDirection, ReactionState} from './types';
import escherSettingsConst from './escherSettings';
import {AppState} from '../store/app.reducers';
import * as fromActions from './store/interactive-map.actions';
import {objectFilter} from '../utils';
import {getSelectedCard} from './store/interactive-map.selectors';
import {selectNotNull} from '../framework-extensions';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LoaderComponent} from './components/loader/loader.component';
import {isLoading} from './components/loader/store/loader.selectors';
import {MapService} from './services/map.service';

const fluxFilter = objectFilter((key, value) => Math.abs(value) > 1e-7);

@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-map.component.scss'],
})
export class AppInteractiveMapComponent implements OnInit, AfterViewInit {
  //private builderSubject = new Subject<escher.BuilderObject>();
  //private builderSubject = new BehaviorSubject<escher.BuilderObject>(null);
  private builderSubject: BehaviorSubject<escher.BuilderObject>;

  public map: escher.PathwayMap;
  public loading = true;
  private card: Card;

  readonly escherSettings = {
    ...escherSettingsConst,
    reaction_state: (args) => this.reactionState(args),
    tooltip_callbacks: {
      knockout: (args) => {
        this.handleKnockout(args);
      },
      setAsObjective: (args) => {
        this.handleSetAsObjective(args);
      },
      changeBounds: (args, lower, upper) => {
        this.handleChangeBounds(args, lower, upper);
      },
      resetBounds: (args) => {
        this.handleResetBounds(args);
      },
      objectiveDirection: (args) => {
        this.handleObjectiveDirection(args);
      },
    },
  };

  constructor(
    private elRef: ElementRef,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private mapsService: MapService,
  ) {
  }

  ngOnInit(): void {


    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'loader';

    this.store.pipe(
      select(isLoading),
    ).subscribe((loading) => {
      if (loading) {
        // opening the dialog throws ExpressionChangedAfterItHasBeenCheckedError
        // See https://github.com/angular/material2/issues/5268#issuecomment-416686390
        // setTimeout(() => ...., 0);
        setTimeout(() => this.dialog.open(LoaderComponent, dialogConfig), 0);
      } else {
        this.dialog.closeAll();
      }
    });
    /*this.builderSubject.asObservable().subscribe((b) => {
      this.store.pipe(
        selectNotNull((store) => store.interactiveMap.mapData)).subscribe((map) => {
        console.log('MAAAAAP', map);
        b.load_map(map);
      });
    });*/
  }

  ngAfterViewInit(): void {
    console.log('AFTER VIEW INIT');
    const element = d3Select(this.elRef.nativeElement.querySelector('.escher-builder'));
    console.log('BUILDER SUBJECT', this.builderSubject);
    if (!this.builderSubject) {
      this.builderSubject = new BehaviorSubject(escher.Builder(
        null,
        null,
        null,
        element,
        this.escherSettings,
      ));
    }
    console.log('BUILDER SUBJECT AFTER', this.builderSubject);
    const builderObservable = this.builderSubject.asObservable();

    this.store.pipe(
      selectNotNull((store) => store.interactiveMap.mapData),
      withLatestFrom(builderObservable),
    ).subscribe(([map, builder]) => {
      console.log('BUILDER MAP', builder, map);
      this.loading = true;
      builder.load_map(map);
      this.loading = false;
    });

    const selectedCard = this.store.pipe(
      selectNotNull(getSelectedCard),
    );

    // Detect changes in model only..
    selectedCard.pipe(
      withLatestFrom(builderObservable),
    ).subscribe(([card, builder]: [Card, escher.BuilderObject]) => {
      this.loading = true;
      this.card = card;
      console.log('CARD', card, builder);
      builder.load_model(card.model);
      builder.set_reaction_data(fluxFilter(card.solution.flux_distribution));
      builder.set_knockout_reactions(card.knockoutReactions);
      builder.set_added_reactions(card.addedReactions.map((reaction) => reaction.bigg_id));
      builder._update_data(true, true);
      this.store.dispatch(new fromActions.Loaded());
      this.loading = false;
    });
  }

  handleKnockout(reactionId: string): void {
    this.store.dispatch(new fromActions.ReactionOperation({
      item: reactionId,
      operationTarget: 'knockoutReactions',
      direction: this.card.knockoutReactions.includes(reactionId) ? OperationDirection.Undo : OperationDirection.Do,
    }));
  }

  handleSetAsObjective(reactionId: string): void {
    if (this.card.objectiveReaction && this.card.objectiveReaction.reactionId === reactionId) {
      this.store.dispatch(new fromActions.SetObjectiveReaction({
        reactionId: null,
        direction: null,
      }));
    } else {
      this.store.dispatch(new fromActions.SetObjectiveReaction({
        reactionId,
        direction: 'max',
      }));
    }
  }

  handleChangeBounds(reactionId: string, lower: string, upper: string): void {
    this.store.dispatch(new fromActions.ReactionOperation({
      item: {
        reaction: this.card.model.reactions.find((r) => r.id === reactionId),
        lowerBound: parseInt(lower, 10),
        upperBound: parseInt(upper, 10),
      },
      operationTarget: 'bounds',
      direction: OperationDirection.Do,
    }));
  }

  handleResetBounds(reactionId: string): void {
    this.store.dispatch(new fromActions.ReactionOperation({
      item: this.card.bounds.find((r) => r.reaction.id === reactionId),
      operationTarget: 'bounds',
      direction: OperationDirection.Undo,
    }));
  }

  handleObjectiveDirection(reactionId: string): void {
    this.store.dispatch(new fromActions.SetObjectiveReaction({
      reactionId,
      direction: this.card.objectiveReaction.direction === 'max' ? 'min' : 'max',
    }));
  }

  upperBound(reactionId: string): number {
    const reaction = this.card.bounds.find((r) => r.reaction.id === reactionId);
    return reaction ? reaction.upperBound : this.card.model.reactions.find((r) => r.id === reactionId).upper_bound;
  }

  lowerBound(reactionId: string): number {
    const reaction = this.card.bounds.find((r) => r.reaction.id === reactionId);
    return reaction ? reaction.lowerBound : this.card.model.reactions.find((r) => r.id === reactionId).lower_bound;
  }

  reactionState(reactionId: string): ReactionState {
    return {
      knockout: this.card.knockoutReactions.includes(reactionId),
      objective: this.card.objectiveReaction,
      bounds: {
        lowerbound: this.lowerBound(reactionId),
        upperbound: this.upperBound(reactionId),
      },
    };
  }
}
