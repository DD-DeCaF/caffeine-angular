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

import {Component} from '@angular/core';

interface Card {
  name: string;
  selected: boolean;
  method: string;
  expanded: boolean;
}
@Component({
  selector: 'app-build',
  templateUrl: './app-build.component.html',
  styleUrls: ['./app-build.component.scss'],
})
export class AppBuildComponent {
  public cards = [
    {
      name: 'foo',
      selected: true,
      method: 'Parsimonious FBA',
      expanded: false,
    },
    {
      name: 'bar',
      selected: false,
      method: 'Flux Balance Analysis (FBA)',
      expanded: false,
    },
  ];

  constructor() {
    this.shouldShow = this.shouldShow.bind(this);
  }

  public delete(card: Card): void {
    console.log(card);
  }

  public grow(card: Card): void {
    card.expanded = true;
  }

  public shrink(card: Card): void {
    card.expanded = false;
  }

  public shouldShow(card: Card): boolean {
    return card.expanded || !this.isAnyExpanded;
  }

  public get isAnyExpanded(): boolean {
    return this.cards.some((c) => c.expanded);
  }
}
