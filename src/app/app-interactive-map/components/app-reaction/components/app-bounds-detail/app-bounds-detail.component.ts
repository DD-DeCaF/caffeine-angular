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

import {Component, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';

import {Bound} from '../../../../types';

@Component({
  selector: 'app-bounds-detail',
  templateUrl: './app-bounds-detail.component.html',
  styleUrls: ['./app-bounds-detail.component.scss'],
})
export class AppBoundsDetailComponent {
  @ViewChild('lowerBound') lowerBound: ElementRef;
  @ViewChild('upperBound') upperBound: ElementRef;

  @Input() public bounds: Bound[];
  @Output() public remove = new EventEmitter<Bound>();
  @Output() public update = new EventEmitter<Bound>();

  public selectedId: string = null;

  removeItem(item: Bound): void {
    if (this.selectedId === item.reaction.id) {
      this.selectedId = null;
    }
    this.remove.emit(item);
  }

  apply(item: Bound, lowerBound: string, upperBound: string): void {

    this.update.emit({
      ...item,
      lowerBound: parseInt(lowerBound, 10),
      upperBound: parseInt(upperBound, 10),
    });
  }

  reset(item: Bound): void {
    this.update.emit({
      ...item,
      lowerBound: null,
      upperBound: null,
    });
  }

  clearSelection(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedId = null;
  }

  select(bound: Bound): void {
    this.selectedId = bound.reaction.id;
  }

  showItem(bound: Bound): boolean {
    return this.selectedId === bound.reaction.id;
  }
}
