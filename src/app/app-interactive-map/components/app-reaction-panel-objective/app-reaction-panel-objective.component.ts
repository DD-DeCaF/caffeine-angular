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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reaction} from '../../types';

@Component({
  selector: 'app-reaction-panel-objective',
  templateUrl: './app-reaction-panel-objective.component.html',
  styleUrls: ['./app-reaction-panel-objective.component.scss'],
})
export class AppReactionPanelObjectiveComponent implements OnInit {
  @Input() public item;

  constructor() { }

  ngOnInit(): void {

  }

  changeDirectionObjective(): void {
    if (this.item.direction === 'max') {
      this.item.direction = 'min';
    } else {
      this.item.direction = 'max';
    }
  }

  removeItem(reaction: Reaction): void {
  }
}
