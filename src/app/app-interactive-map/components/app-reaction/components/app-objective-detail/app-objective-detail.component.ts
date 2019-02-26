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

import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import { MatSlideToggle, MatButton, MatSlideToggleChange } from '@angular/material';

import { ObjectiveReactionPayload } from '../../../../types';

@Component({
  selector: 'app-objective-detail',
  templateUrl: './app-objective-detail.component.html',
  styleUrls: ['./app-objective-detail.component.scss'],
})
export class AppObjectiveDetailComponent {
  @ViewChild('toggle') toggleSwitch: MatSlideToggle;
  @ViewChild('remove') removeButton: MatButton;

  @Input() public objectiveReaction: Observable<ObjectiveReactionPayload>;
  // tslint:disable-next-line:no-any
  @Input() private reactions: any[];
  @Output() public changeDirection: EventEmitter<'max' | 'min'> = new EventEmitter();
  @Output() public remove: EventEmitter<string> = new EventEmitter();

  toggleChange({checked}: MatSlideToggleChange): void {
    this.changeDirection.emit(checked ? 'max' : 'min');
  }

  getReactionName(reactionId: string): string {
    return this.reactions.find((reaction) => reaction.id === reactionId).name;
  }

  removeObjective(): void {
    this.remove.emit();
  }
}
