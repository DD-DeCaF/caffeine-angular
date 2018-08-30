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

import {Component, ViewChild, ElementRef, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppState} from '../../../../../store/app.reducers';
import {ReactionOperation} from '../../../../store/interactive-map.actions';
import {Bound, OperationDirection, HydratedCard} from '../../../../types';

@Component({
  selector: 'app-bounds',
  templateUrl: './app-bounds.component.html',
  styleUrls: ['./app-bounds.component.scss'],
})
export class AppBoundsComponent {
  @ViewChild('lowerBound') lowerBound: ElementRef;
  @ViewChild('upperBound') upperBound: ElementRef;
  @Input() public card: Observable<HydratedCard>;

  public selectedItem: Bound = null;

  constructor(private store: Store<AppState>) {}

  removeItem(item: Bound): void {
    this.store.dispatch(new ReactionOperation({
      item,
      operationTarget: 'bounds',
      direction: OperationDirection.Undo,
    }));
    this.selectedItem = null;
  }

  select(item: Bound): void {
    this.selectedItem = item;
    this.lowerBound.nativeElement.value = item.lowerBound;
    this.upperBound.nativeElement.value = item.upperBound;
  }

  apply(item: Bound, lowerBound: number, upperBound: number): void {
    this.store.dispatch(new ReactionOperation({
      item: {
        ...item,
        lowerBound,
        upperBound,
      },
      operationTarget: 'bounds',
      direction: OperationDirection.Do,
    }));
    this.selectedItem = null;
  }

  reset(item: Bound): void {
    this.store.dispatch(new ReactionOperation({
      item: {
        ...item,
        lowerBound: null,
        upperBound: null,
      },
      operationTarget: 'bounds',
      direction: OperationDirection.Do,
    }));
  }

  showItem(item: Bound): boolean {
    return this.selectedItem && this.selectedItem.reactionId === item.reactionId;
  }

}
