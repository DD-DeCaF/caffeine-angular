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

import {Component, ViewChild, AfterViewInit, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';

import {AppState} from '../../../../../store/app.reducers';
import {SetObjectiveReaction} from '../../../../store/interactive-map.actions';
import {HydratedCard, Cobra, AddedReaction} from '../../../../types';
import {AppPanelComponent} from '../app-panel/app-panel.component';
import {AppObjectiveDetailComponent} from '../app-objective-detail/app-objective-detail.component';

@Component({
  selector: 'app-objective',
  templateUrl: './app-objective.component.html',
})
export class AppObjectiveComponent implements AfterViewInit {
  @ViewChild('panel') panel: AppPanelComponent;
  @ViewChild('detail') detail: AppObjectiveDetailComponent;

  @Input() card: HydratedCard;

  public reactions$: Observable<string[]>;
  public reactionsSubject = new Subject<string[]>();

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
            reaction.id.toLowerCase().includes(queryString))
          .map((reaction) => reaction.id);
        this.reactionsSubject.next(results);
      });

    this.panel.select
      .subscribe((reactionId: string) => {
        this.store.dispatch(new SetObjectiveReaction({
          reactionId,
          direction: 'max',
        }));
      });

    this.detail.remove.subscribe(() => {
      this.store.dispatch(new SetObjectiveReaction({
        reactionId: null,
        direction: null,
      }));
    });

    this.detail.changeDirection
      .subscribe((direction: 'max' | 'min') => {
        this.store.dispatch(new SetObjectiveReaction({
          reactionId: this.card.objectiveReaction.reactionId,
          direction,
        }));
      });
  }
}
