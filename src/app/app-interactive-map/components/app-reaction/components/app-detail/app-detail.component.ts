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

import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppState} from '../../../../../store/app.reducers';
import {ReactionOperation} from '../../../../store/interactive-map.actions';
import {OperationDirection} from '../../../../types';
import {HydratedCard, getSelectedCard} from '../../../../store/interactive-map.selectors';

@Component({
  selector: 'app-detail',
  templateUrl: './app-detail.component.html',
})

export class AppDetailComponent implements OnInit {
  @Input() public type: string;
  public card: Observable<HydratedCard>;
  private removeEmitter = new EventEmitter<string>();

  public typeToTarget = {
    added: 'addedReactions',
    knockout: 'knockoutReactions',
  };

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.card = this.store.pipe(
      select(getSelectedCard));

    this.removeEmitter
      .subscribe((reactionId) => {
        this.store.dispatch(new ReactionOperation({
          item: reactionId,
          direction: OperationDirection.Undo,
          operationTarget: this.typeToTarget[this.type],
        }));
      });
  }

  remove(item: string): void {
    this.removeEmitter.emit(item);
  }
}
