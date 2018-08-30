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
import {Observable, fromEvent} from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { MatSlideToggle, MatButton } from '@angular/material';

import {AppState} from '../../../../../store/app.reducers';
import {SetObjectiveReaction} from '../../../../store/interactive-map.actions';
import { HydratedCard } from '../../../../types';

@Component({
  selector: 'app-objective',
  templateUrl: './app-objective.component.html',
  styleUrls: ['./app-objective.component.scss'],
})
export class AppObjectiveComponent implements AfterViewInit {
  @ViewChild('toggle') toggle: MatSlideToggle;
  @ViewChild('remove') remove: MatButton;

  @Input() public card: Observable<HydratedCard>;

  constructor(private store: Store<AppState>) {}

  ngAfterViewInit(): void {
    this.toggle.change.pipe(
      withLatestFrom(this.card),
    ).subscribe(([{checked}, card]) => {
      this.store.dispatch(new SetObjectiveReaction({
        reactionId: card.objectiveReaction.reactionId,
        direction: checked ? 'max' : 'min',
      }));
    });

    fromEvent(this.remove._elementRef.nativeElement, 'click')
      .subscribe(() => {
        this.store.dispatch(new SetObjectiveReaction({
          reactionId: null,
          direction: null,
        }));
      });
  }
}
