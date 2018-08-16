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
import {BoundsReaction} from '../../types';

@Component({
  selector: 'app-reaction-panel-changed',
  templateUrl: './app-reaction-panel-changed.component.html',
  styleUrls: ['./app-reaction-panel-changed.component.scss'],
})
export class AppReactionPanelChangedComponent {
  public reactions: {
    [reactionId: string]: {
      lowerBound: number,
      upperBound: number,
    },
  };
  public clickedItem: string;
  public lowerBound: number;
  public upperBound: number;
  private subscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.subscription = this.store.select('interactiveMap')
      .subscribe(
        (interactiveMap) => {
          this.reactions = interactiveMap.cards.cardsById[interactiveMap.selectedCardId].bounds;
        },
      );
  }

  removeItem(): void {
  }

  clickedItemFunction(item: BoundsReaction): void {
    this.clickedItem = item.reactionId;
    this.lowerBound = item.lowerBound;
    this.upperBound = item.upperBound;
  }

  changedReactionDisplay(item: BoundsReaction): string {
    return item.reactionId;
  }

  showItem(item: BoundsReaction, index: number): boolean {
    return this.clickedItem === item.reactionId || (index === 0 && !this.clickedItem);
  }

 /* onResetBounds(selectedReaction): void {
   console.log('ON RESET');
  }

  onApplyBounds(selectedReaction): void {
    console.log('ON APPLY');
  }*/
}
