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

import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {AppState} from '../../../../../store/app.reducers';
import {OperationReaction} from '../../../../store/interactive-map.actions';
import {OperationDirection} from '../../../../types';


@Component({
  selector: 'app-detail',
  templateUrl: './app-detail.component.html',
})

export class AppDetailComponent implements OnInit{
  public reactions: string[] = [];
  @Input() public type: string;
  protected subscription: Subscription;
  protected typeToTarget = {
    'added': 'addedReactions',
    'knockout': 'knockoutReactions',
  };
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store.select('interactiveMap')
      .subscribe(
        (interactiveMap) => {
          this.reactions = interactiveMap.cards.cardsById[interactiveMap.selectedCardId][this.typeToTarget[this.type]];
        },
      );
  }

  removeItem(reaction: string): void {

    this.store.dispatch(new OperationReaction({
      cardId: '',
      reactionId: reaction,
      operationTarget: this.typeToTarget[this.type],
      direction: OperationDirection.Undo,
    }));
  }
}
