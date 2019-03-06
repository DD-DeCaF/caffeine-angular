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

import {Component, ViewChild, Input, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../../store/app.reducers';
import { ReactionOperation } from '../../../../store/interactive-map.actions';
import { HydratedCard, Cobra, BoundedReaction, OperationDirection } from '../../../../types';

import { AppBoundsDetailComponent } from '../app-bounds-detail/app-bounds-detail.component';
import { AppPanelComponent } from '../app-panel/app-panel.component';

@Component({
  selector: 'app-bounds',
  templateUrl: './app-bounds.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBoundsComponent implements AfterViewInit {
  @ViewChild('panel') panel: AppPanelComponent;
  @ViewChild('detail') detail: AppBoundsDetailComponent;

  @Input() card: HydratedCard;

  public reactions$: Observable<Cobra.Reaction[]>;
  public reactionsSubject = new Subject<Cobra.Reaction[]>();

  constructor(
    public store: Store<AppState>,
  ) {
    this.reactions$ = this.reactionsSubject.asObservable();
  }

  ngAfterViewInit(): void {
    this.panel.query
      .subscribe((query: string) => {
        const queryString = query.toLocaleLowerCase();
        const results = this.card.model.reactions
          .filter((reaction: Cobra.Reaction) =>
            reaction.id.toLowerCase().includes(queryString));
        this.reactionsSubject.next(results);
      });

    this.panel.select
      .subscribe((reaction: Cobra.Reaction) => {
        this.store.dispatch(new ReactionOperation({
          item: {
            reaction,
            lowerBound: reaction.lower_bound,
            upperBound: reaction.upper_bound,
          },
          operationTarget: 'bounds',
          direction: OperationDirection.Do,
        }));
    });

    this.detail.remove.subscribe((item: BoundedReaction) => {
      this.store.dispatch(new ReactionOperation({
        item: item,
        operationTarget: 'bounds',
        direction: OperationDirection.Undo,
      }));
    });

    this.detail.update.subscribe((item: string) => {
      this.store.dispatch(new ReactionOperation({
          item,
          operationTarget: 'bounds',
          direction: OperationDirection.Do,
        }));
    });
  }

  display(reaction: Cobra.Reaction): string {
    return reaction.id;
  }
}
