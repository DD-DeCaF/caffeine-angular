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

import {Component, Inject, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import * as types from '../../../app-interactive-map/types';
import * as fromActions from '../../store/maps.actions';
import {RemovedMapComponent} from './removed-map.component';

@Component({
  selector: 'app-remove-model',
  templateUrl: './remove-map.component.html',
  styleUrls: ['./remove-map.component.scss'],
})
export class RemoveMapComponent implements OnInit {

  public error: Observable<Boolean>;
  public map: types.MapItem;

  constructor(
    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.map = this.data.map;
    this.error = this.store.pipe(select((store) => store.maps.error));
    this.store.pipe(select((store) => store.maps.removedMap)).subscribe((removedMap) => {
      if (removedMap) {
        this.dialog.closeAll();
        this.snackBar.openFromComponent(RemovedMapComponent, {
          duration: 2000,
        });
      }
    });
  }

  removeMap(): void {
    this.store.dispatch(new fromActions.RemoveMap(this.map.id));
  }

  close(): void {
    this.dialog.closeAll();
  }

}
