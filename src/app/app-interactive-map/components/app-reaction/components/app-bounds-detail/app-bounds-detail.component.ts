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
import {BoundedReaction} from '../../../../types';
import {MatDialog} from '@angular/material';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';

@Component({
  selector: 'app-bounds-detail',
  templateUrl: './app-bounds-detail.component.html',
  styleUrls: ['./app-bounds-detail.component.scss'],
})

export class AppBoundsDetailComponent {
  @ViewChild('lowerBound') lowerBound: ElementRef;
  @ViewChild('upperBound') upperBound: ElementRef;

  @Input() public bounds: BoundedReaction[];
  @Output() public remove = new EventEmitter<BoundedReaction>();
  @Output() public update = new EventEmitter<BoundedReaction>();


  constructor(public dialog: MatDialog) {}

  public selectedId: string = null;

  removeItem(item: BoundedReaction): void {
    if (this.selectedId === item.reaction.id) {
      this.selectedId = null;
    }
    this.remove.emit(item);
  }

  apply(item: BoundedReaction, lowerBound: string, upperBound: string): void {
    if (this.lowerBound.nativeElement.value <= this.upperBound.nativeElement.value) {
      this.update.emit({
        ...item,
        lowerBound: parseFloat(lowerBound),
        upperBound: parseFloat(upperBound),
      });
    } else if (this.lowerBound.nativeElement.value > this.upperBound.nativeElement.value) {
        const dialogRef = this.dialog.open(ErrorMsgComponent, {width: '250px'});
    }
  }

  reset(item: BoundedReaction): void {
    this.update.emit({
      ...item,
      lowerBound: item.reaction.lower_bound,
      upperBound: item.reaction.upper_bound,
    });
  }

  clearSelection(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedId = null;
  }

  select(bound: BoundedReaction): void {
    this.selectedId = bound.reaction.id;
  }

  showItem(bound: BoundedReaction): boolean {
    return this.selectedId === bound.reaction.id;
  }
}
