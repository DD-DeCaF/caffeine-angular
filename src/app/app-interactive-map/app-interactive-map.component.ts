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
import {ModalErrorComponent} from './components/modal-error/modal-error.component';

const fluxFilter = objectFilter((key, value) => Math.abs(value) > 1e-7);

@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-map.component.scss'],
})
export class AppInteractiveMapComponent implements OnInit, AfterViewInit {
  private builderSubject = new Subject<escher.BuilderObject>();
  public map: Observable<escher.PathwayMap>;
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
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.FetchSpecies());
    this.store.dispatch(new fromActions.FetchMaps());
    this.store.dispatch(new fromActions.FetchModels());

    const builderObservable = this.builderSubject.asObservable();
    this.store.pipe(
      selectNotNull((store) => store.interactiveMap.mapData),
      withLatestFrom(builderObservable),
    ).subscribe(([map, builder]) => {
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
      builder.load_model(card.model);
      builder.set_reaction_data(fluxFilter(card.solution.flux_distribution));
      builder.set_knockout_reactions(card.knockoutReactions);
      builder.set_added_reactions(card.addedReactions.map((reaction) => reaction.bigg_id));
      builder._update_data(true, true);
      this.store.dispatch(new fromActions.Loaded());
      this.loading = false;
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'loader';
    dialogConfig.id = 'loader';

    const dialogConfigError = new MatDialogConfig();
    dialogConfigError.disableClose = true;
    dialogConfigError.autoFocus = true;
    dialogConfigError.panelClass = 'loader';
    dialogConfigError.id = 'error';

    this.store.pipe(
      select(isLoading),
    ).subscribe((loading) => {
      if (loading) {
        // opening the dialog throws ExpressionChangedAfterItHasBeenCheckedError
        // See https://github.com/angular/material2/issues/5268#issuecomment-416686390
        // setTimeout(() => ...., 0);
        if (!this.dialog.openDialogs.find((dialog) => dialog.id === 'loader')) {
          setTimeout(() => this.dialog.open(LoaderComponent, dialogConfig), 0);
        }
      } else {
        this.store.pipe(select((store) => store.loader.loadingError)).subscribe((loadingError) => {
          if (loadingError) {
            if (!this.dialog.openDialogs.find((dialog) => dialog.id === 'error')) {
              setTimeout(() => this.dialog.open(ModalErrorComponent, dialogConfigError), 0);
            }
          } else {
            this.dialog.closeAll();
          }
        });
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
    const reactionModel = this.card.model.reactions.find((r) => r.id === reactionId);
    return reaction ? reaction.upperBound : reactionModel ? reactionModel.upper_bound : null;
  }

  lowerBound(reactionId: string): number {
    const reaction = this.card.bounds.find((r) => r.reaction.id === reactionId);
    const reactionModel = this.card.model.reactions.find((r) => r.id === reactionId);
    return reaction ? reaction.lowerBound : reactionModel ? reactionModel.lower_bound : null;
  }

  reactionState(reactionId: string): ReactionState {
    return {
      includedInModel: !!this.card.model.reactions.find((r) => r.id === reactionId),
      knockout: this.card.knockoutReactions.includes(reactionId),
      objective: this.card.objectiveReaction,
      bounds: {
        lowerbound: this.lowerBound(reactionId),
        upperbound: this.upperBound(reactionId),
      },
    };
  }
}
