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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Reaction} from '../../types';

@Component({
  selector: 'app-reaction-panel-changed',
  templateUrl: './app-reaction-panel-changed.component.html',
  styleUrls: ['./app-reaction-panel-changed.component.scss'],
})
export class AppReactionPanelChangedComponent implements OnInit, OnChanges {
  @Input() public itemsSelected: Reaction[] = [];
  @Input() public type: string;
  public clickedItem: string;
  public lowerbound: number;
  public upperbound: number;
  constructor() { }

  ngOnInit(): void {
  }

  removeItem(reaction: Reaction): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const itemsSelected: SimpleChange = changes.itemsSelected;
    this.itemsSelected = itemsSelected.currentValue;
  }

  clickedItemFunction(item): void {
    this.clickedItem = item.id;
    this.lowerbound = item.lower_bound;
    this.upperbound = item.upper_bound;
  }

  changedReactionDisplay(item): string {
    return item.id;
  }

  showItem(item, index): boolean {
    return this.clickedItem === item.id || (index === 0 && !this.clickedItem) || this.itemsSelected.length === 1;
  }

  onResetBounds(selectedReaction): void {
   console.log('ON RESET');
  }

  onApplyBounds(selectedReaction): void {
    console.log('ON APPLY');
  }


}
