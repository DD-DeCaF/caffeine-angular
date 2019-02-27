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

import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {AppState} from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {isLoading} from './store/loader.selectors';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class LoaderComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  loading: Observable<boolean>;

  ngOnInit(): void {
    this.loading = this.store.pipe(select(isLoading));
  }
}

