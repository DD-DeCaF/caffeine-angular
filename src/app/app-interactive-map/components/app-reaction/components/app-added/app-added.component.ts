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

import {Component, AfterViewInit, ViewChild, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { AppPanelComponent } from '../app-panel/app-panel.component';
import { BiggSearchService } from '../app-panel/services/bigg-search.service';
import { Reaction, HydratedCard, AddedReaction, OperationDirection } from '../../../../types';
import { AppState } from '../../../../../store/app.reducers';
import { AppDetailComponent } from '../app-detail/app-detail.component';
import { ReactionOperation } from '../../../../store/interactive-map.actions';

@Component({
  selector: 'app-added',
  templateUrl: './app-added.component.html',
})
export class AppAddedComponent implements AfterViewInit {
  @ViewChild('panel') panel: AppPanelComponent;
  @ViewChild('detail') detail: AppDetailComponent;

  @Input() card: HydratedCard;

  public reactions$: Observable<Reaction[]>;
  public reactionsSubject = new Subject<Reaction[]>();

  constructor(
    public store: Store<AppState>,
    private biggSearchService: BiggSearchService,
  ) {
    this.reactions$ = this.reactionsSubject.asObservable();
  }

  ngAfterViewInit(): void {
    this.panel.query
      .pipe(
        switchMap((query) => this.biggSearchService.search(query)),
      )
      .subscribe((results) => {
        this.reactionsSubject.next(results);
      });

    this.panel.select.pipe(
      switchMap((reaction) => this.biggSearchService.getDetails(reaction)),
    ).subscribe((reaction: AddedReaction) => {
      this.store.dispatch(new ReactionOperation({
        item: reaction,
        operationTarget: 'addedReactions',
        direction: OperationDirection.Do,
      }));
    });

    this.detail.remove.subscribe((item: AddedReaction) => {
      this.store.dispatch(new ReactionOperation({
        item: item,
        operationTarget: 'addedReactions',
        direction: OperationDirection.Undo,
      }));
    });
  }

  display(reaction: AddedReaction): string {
    return reaction.bigg_id;
  }
}
