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

import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormControl} from '@angular/forms';
import {AppState} from '../../../../../store/app.reducers';
import {BiggSearch, OperationDirection, Reaction} from '../../../../types';
import {ReactionOperation, SetObjectiveReaction} from '../../../../store/interactive-map.actions';
import {BiggSearchService} from './services/bigg-search.service';

@Component({
  selector: 'app-panel',
  templateUrl: './app-panel.component.html',
  styleUrls: ['./app-panel.component.scss'],
})
export class AppPanelComponent {
  @Input() public title: string;
  @Input() public type: string;
  @Input() public placeholder: string;
  @ViewChild('queryInput') queryInput: ElementRef;

  public querySearch: FormControl = new FormControl();
  public reactions: Reaction[] = [];


  constructor(
    private store: Store<AppState>,
    private biggSearchService: BiggSearchService) {}

  displayFn(item: Reaction): string {
    return item && item.bigg_id;
  }

  addItem(reaction: Reaction): void {
    const typeToTarget: {[k: string]: 'addedReactions' | 'knockoutReactions'} = {
      added: 'addedReactions',
      knockout: 'knockoutReactions',
    };

    switch (this.type) {
      case 'added':
      case 'knockout': {
        this.store.dispatch(new ReactionOperation({
          item: reaction.bigg_id,
          operationTarget: typeToTarget[this.type],
          direction: OperationDirection.Do,
        }));
        break;
      }
      case 'bounds': {
        this.store.dispatch(new ReactionOperation({
          item: {
            reactionId: reaction.bigg_id,
            lowerBound: null,
            upperBound: null,
          },
          operationTarget: 'bounds',
          direction: OperationDirection.Do,
        }));
        break;
      }
      default: {
        this.store.dispatch(new SetObjectiveReaction({
          reactionId: reaction.bigg_id,
          direction: 'max',
        }));
      }
    }
    this.reactions = [];
    this.querySearch.reset('');
  }

  queryChange(query: string): void {
    if (query.length > 2) {
      this.biggSearchService.search(query).subscribe((data: BiggSearch) => {
        this.reactions = data.results;
      });
    }
  }
}
