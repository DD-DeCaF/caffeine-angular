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

import {Component, AfterViewInit, ElementRef, OnInit, OnDestroy, NgZone, ChangeDetectionStrategy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {select as d3Select} from 'd3';
import * as escher from '@dd-decaf/escher';

import {
  AddedReaction, BoundedReaction,
  BoundOperationPayload,
  Card,
  CardType,
  ObjectiveReactionPayload,
  OperationDirection,
  OperationPayload,
  ReactionState,
} from './types';
import escherSettingsConst from './escherSettings';
import * as fromActions from './store/interactive-map.actions';
import {getSelectedCard} from './store/interactive-map.selectors';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {LoaderComponent} from './components/loader/loader.component';
import {_mapValues, objectFilter} from '../utils';
import {AppState} from '../store/app.reducers';
import {selectNotNull} from '../framework-extensions';
import {combineLatest, Observable, Subject} from 'rxjs';
import {ModalErrorComponent} from './components/modal-error/modal-error.component';
import {PathwayMap} from '@dd-decaf/escher';
import {withLatestFrom} from 'rxjs/operators';
import {Loaded, SetMap} from './store/interactive-map.actions';
import {ErrorMsgComponent} from './components/app-reaction/components/error-msg/error-msg.component';

const fluxFilter = objectFilter((key, value) => Math.abs(value) > 1e-7);
const MOBILE_MAX_WIDTH = 425;


@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppInteractiveMapComponent implements OnInit, AfterViewInit, OnDestroy {

  private builder: escher.BuilderObject = null;
  private builderSubject = new Subject<escher.BuilderObject>();
  public map: escher.PathwayMap;
  public loading = true;
  private card: Card;
  private selectedCard;
  private selectedCardBuilder;
  private mapObservable;
  private updateReactions;
  private loadingObservable;
  private errorObservable;
  private cardSelected;
  public progressBar: Observable<boolean>;
  public action: Observable<string>;

  public isMobile: boolean;

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
      knockoutGenes: (args) => {
        this.handleKnockoutGenes(args);
      },
    },
    first_load_callback: () => this.firstLoadEscher(),
  };

  constructor(
    private elRef: ElementRef,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private ngZoneService: NgZone,
    public snackBar: MatSnackBar,
  ) {
    this.isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
  }

  ngOnInit(): void {
    const builderObservable = this.builderSubject.asObservable();
    this.mapObservable = combineLatest(
      this.store.pipe(
        selectNotNull((store) => store.interactiveMap.mapData)),
      builderObservable,
    ).subscribe(([map, builder]) => {
      builder.load_map(map);
    });

    this.selectedCard = this.store.pipe(
      selectNotNull(getSelectedCard),
    );

    this.selectedCard.subscribe((card) => this.cardSelected = card);

    this.updateReactions = this.store.pipe(
      selectNotNull((store) => store.interactiveMap.mapData)).pipe(
      withLatestFrom(
        this.selectedCard,
        builderObservable,
      )).subscribe(([map, card, builder]: [PathwayMap, Card, escher.BuilderObject]) => {
      this.updateBuilder(builder, card);
    });

    // Detect changes in model only..
    this.selectedCardBuilder = combineLatest(
      this.selectedCard,
      builderObservable,
    ).subscribe(([card, builder]: [Card, escher.BuilderObject]) => {
      this.loading = true;
      this.card = card;
      this.updateBuilder(builder, card);
      this.loading = false;
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'loader';
    dialogConfig.id = 'loading';
    dialogConfig.data = 'Calculating flux distribution...';

    const dialogConfigError = new MatDialogConfig();
    dialogConfigError.disableClose = true;
    dialogConfigError.autoFocus = true;
    dialogConfigError.panelClass = 'loader';
    dialogConfigError.id = 'error';

    let error = false;

    this.loadingObservable = this.store.pipe(select((store) => store.loader.loading)).subscribe((loading) => {
      if (loading) {
        // opening the dialog throws ExpressionChangedAfterItHasBeenCheckedError
        // See https://github.com/angular/material2/issues/5268#issuecomment-416686390
        // setTimeout(() => ...., 0);
        if (!this.dialog.openDialogs.find((dialog) => dialog.id === 'loading')) {
          setTimeout(() => this.dialog.open(LoaderComponent, dialogConfig), 0);
        }
      } else {
        this.errorObservable = this.store.pipe(select((store) => store.loader.loadingError)).subscribe((loadingError) => {
          if (loadingError && !error) {
            setTimeout(() => this.dialog.open(ModalErrorComponent, dialogConfigError), 0);
            error = true;
          } else {
            setTimeout(() => this.closeDialogs(), 0);
            error = false;
          }
        });
      }
    });

    this.progressBar = this.store.pipe(select((store) => store.interactiveMap.progressBar));
    this.store.pipe(select((store) => store.interactiveMap.action)).subscribe(
      (action: OperationPayload | ObjectiveReactionPayload | BoundOperationPayload) => {
        if (action) {
          const {item, operationTarget, direction} = action;
          let actionString;
          if (operationTarget) {
            if (operationTarget === 'bounds') {
              actionString = direction === 'DO' ? `Bounds of reaction ${(<BoundedReaction>item).reaction.id} were changed.` :
                `Bounds of reaction ${(<BoundedReaction>item).reaction.id} were reset.`;
            } else if (operationTarget === 'addedReactions') {
              actionString = direction === 'DO' ? `Reaction ${(<AddedReaction>item).bigg_id} was added.` :
                `Reaction ${(<AddedReaction>item).bigg_id} was removed.`;
            } else {
              if (operationTarget === 'knockoutGenes') {
                actionString = direction === 'DO' ? `Gene ${item} was knocked out.` :
                  `Gene ${item} was undo knocked out.`;
              } else {
                actionString = direction === 'DO' ? `Reaction ${item} was knocked out.` :
                  `Reaction ${item} was undo knocked out.`;
              }
            }
          } else {
            actionString = direction ? `Reaction ${(<ObjectiveReactionPayload>action).reactionId} was set as objective.` :
              `Reaction ${(<ObjectiveReactionPayload>action).reactionId} was undo set as objective.`;
          }
          this.snackBar.open(`${actionString}`, '', {
            duration: 2000,
          });
        }
      });
  }

  ngAfterViewInit(): void {
    const element = d3Select(this.elRef.nativeElement.querySelector('.escher-builder'));
    this.builder = escher.Builder(
      null,
      null,
      null,
      element,
      this.escherSettings,
    );
  }

  handleKnockout(reactionId: string): void {
    this.store.dispatch(new fromActions.ReactionOperation({
      item: reactionId,
      operationTarget: 'knockoutReactions',
      direction: this.card.knockoutReactions.includes(reactionId) ? OperationDirection.Undo : OperationDirection.Do,
    }));
  }

  handleKnockoutGenes(reactionId: string): void {
    this.store.dispatch(new fromActions.ReactionOperation({
      item: reactionId,
      operationTarget: 'knockoutGenes',
      direction: this.card.knockoutGenes.includes(reactionId) ? OperationDirection.Undo : OperationDirection.Do,
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
    const lowerBound = parseFloat(lower);
    const upperBound = parseFloat(upper);
    if (lowerBound <= upperBound) {
      this.store.dispatch(new fromActions.ReactionOperation({
        item: {
          reaction: this.card.model.reactions.find((r) => r.id === reactionId),
          lowerBound,
          upperBound,
        },
        operationTarget: 'bounds',
        direction: OperationDirection.Do,
      }));
    } else {
      this.dialog.open(ErrorMsgComponent, {width: '250px'});
    }
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
      includedInModel: this.cardSelected.type === CardType.DataDriven ? false : Boolean(this.card.model.reactions.find((r) => r.id === reactionId)),
      knockout: this.card.knockoutReactions.includes(reactionId),
      knockoutGenes: this.card.knockoutGenes.includes(reactionId),
      objective: this.card.objectiveReaction,
      bounds: {
        lowerbound: this.lowerBound(reactionId),
        upperbound: this.upperBound(reactionId),
      },
    };
  }

  firstLoadEscher(): void {
    this.builderSubject.next(this.builder);
  }

  public closeDialogs(): void {
    this.ngZoneService.runOutsideAngular(() => {
      this.ngZoneService.run(() => {
        this.dialog.closeAll();
      });
    });
  }

  private updateBuilder(builder: escher.BuilderObject, card: Card): void {
    if (card.type === CardType.DataDriven) {
      if (!card.solutionUpdated) {
        builder.load_model(null);
        const reactionData = _mapValues(card.solution.flux_distribution,
          (d) => (d.upper_bound + d.lower_bound) / 2);
        builder.set_reaction_fva_data(reactionData);
        builder.set_reaction_data(null);
      } else {
        builder.load_model(card.model);
        if (card.method === 'fva' || card.method === 'pfba-fva') {
          const reactionData = _mapValues(card.solution.flux_distribution,
            (d) => (d.upper_bound + d.lower_bound) / 2);
          builder.set_reaction_fva_data(card.solution.flux_distribution);
          builder.set_reaction_data(fluxFilter(reactionData));
        } else {
          builder.set_reaction_fva_data(card.solution.flux_distribution);
          builder.set_reaction_data(fluxFilter(card.solution.flux_distribution));
        }
        this.store.dispatch(new Loaded());
      }
      builder.set_knockout_reactions(card.knockoutReactions);
      builder.set_knockout_genes(card.knockoutGenes);
      builder.set_added_reactions(card.addedReactions
        .filter((reaction) => !reaction.bigg_id.startsWith('DM_'))
        .map((reaction) => reaction.bigg_id),
      );
      builder.set_highlight_reactions(card.measurements.map((m) => m.id));
      builder._update_data(true, true);
    } else {
      builder.load_model(card.model);
      if (card.method === 'fva' || card.method === 'pfba-fva') {
        const reactionData = _mapValues(card.solution.flux_distribution,
          (d) => (d.upper_bound + d.lower_bound) / 2);
        builder.set_reaction_fva_data(card.solution.flux_distribution);
        builder.set_reaction_data(fluxFilter(reactionData));
      } else {
        builder.set_reaction_fva_data(card.solution.flux_distribution);
        builder.set_reaction_data(fluxFilter(card.solution.flux_distribution));
      }
      builder.set_knockout_reactions(card.knockoutReactions);
      builder.set_knockout_genes(card.knockoutGenes);
      builder.set_added_reactions(card.addedReactions
        .filter((reaction) => !reaction.bigg_id.startsWith('DM_'))
        .map((reaction) => reaction.bigg_id),
      );
      builder.set_highlight_reactions(card.measurements.map((m) => m.id));
      builder._update_data(true, true);
      this.store.dispatch(new Loaded());
    }
  }

  ngOnDestroy(): void {
    this.selectedCardBuilder.unsubscribe();
    this.builderSubject.unsubscribe();
    this.store.pipe(selectNotNull((store) => store.interactiveMap.selectedMap)).subscribe((map) => {
      this.store.dispatch(new SetMap(map));
    });
    this.mapObservable.unsubscribe();
    this.updateReactions.unsubscribe();
    this.loadingObservable.unsubscribe();
    if (this.errorObservable) {
      this.errorObservable.unsubscribe();
    }
  }
}
