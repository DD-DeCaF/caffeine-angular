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

import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {Subscription} from 'rxjs';
import {ObjectiveReaction} from '../../types';
import {SetObjectiveReaction} from '../../store/interactive-map.actions';

@Component({
  selector: 'app-reaction-panel-objective',
  templateUrl: './app-reaction-panel-objective.component.html',
  styleUrls: ['./app-reaction-panel-objective.component.scss'],
})
export class AppReactionPanelObjectiveComponent {
  public objectiveReaction: ObjectiveReaction;
  private subscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.subscription = this.store.select('interactiveMap')
      .subscribe(
        (interactiveMap) => {
          this.objectiveReaction = interactiveMap.cards.cardsById[interactiveMap.selectedCardId].objectiveReaction;
        },
      );
  }

  changeDirectionObjective(): void {
    const direction = this.objectiveReaction.direction === 'max' ? 'min' : 'max';
    this.store.dispatch(new SetObjectiveReaction({
        cardId: this.objectiveReaction.cardId,
        reactionId: this.objectiveReaction.reactionId,
        operationTarget: this.objectiveReaction.operationTarget,
        direction: direction}));
  }

  removeObjective(): void {
    this.store.dispatch(new SetObjectiveReaction({
      cardId: this.objectiveReaction.cardId,
      reactionId: null,
      operationTarget: this.objectiveReaction.operationTarget,
      direction: null}));
  }
}
