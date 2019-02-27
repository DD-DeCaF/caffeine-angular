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

import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {FormControl} from '@angular/forms';
import { Reaction } from '../../../../types';

@Component({
  selector: 'app-panel',
  templateUrl: './app-panel.component.html',
  styleUrls: ['./app-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPanelComponent {
  @Input() public title: string;
  @Input() public placeholder: string;

  // tslint:disable-next-line:no-any
  @Input() public display: (item: any) => string;
  // tslint:disable-next-line:no-any
  @Input() public queryHits: any[] = [];
  @Output() public query = new EventEmitter<string>();
  // tslint:disable-next-line:no-any
  @Output() public select = new EventEmitter<any>();

  public querySearch: FormControl = new FormControl();

  // tslint:disable-next-line:no-any
  displayFn(item: any): string {
    return this.display ? this.display(item) : item;
  }

  addItem(reaction: Reaction): void {
    this.select.emit(reaction);
    this.querySearch.reset('');
  }

  queryChange(query: string): void {
    if (query.length > 0) {
      this.query.emit(query);
    }
  }
}
