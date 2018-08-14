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

import {Component, OnInit} from '@angular/core';
import {Reaction, Reactions} from '../../types';

@Component({
  selector: 'app-reaction',
  templateUrl: './app-reaction.component.html',
  styleUrls: ['./app-reaction.component.scss'],
})
export class AppReactionComponent implements OnInit {
  public itemsSelected: Reactions = {
    added: [],
    removed: [],
    objective: {
      reaction: {
        bigg_id: null,
        name: null,
        model_bigg_id: null,
        organism: null,
        },
      direction: null,
    },
    changed: [],
  };
  public itemRemoved: Reaction;
  constructor() { }

  ngOnInit(): void {
  }

  onItemSelected(reactions: Reactions): void {
    this.itemsSelected = reactions;
  }

  removeItem(reaction: Reaction): void {
    this.itemRemoved = reaction;
  }

}
