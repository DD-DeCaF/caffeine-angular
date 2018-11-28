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

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {AppState} from '../store/app.reducers';
import {select, Store} from '@ngrx/store';
import * as fromActions from './store/maps.actions';
import * as types from '../app-interactive-map/types';
import {Observable} from 'rxjs';
import {EditMapComponent} from './components/edit-map/edit-map.component';
import {RemoveMapComponent} from './components/remove-map/remove-map.component';
import {AddMapComponent} from './components/add-map/add-map.component';
import {SessionState} from '../session/store/session.reducers';

@Component({
  selector: 'app-models',
  templateUrl: './app-maps.component.html',
  styleUrls: ['./app-maps.component.scss'],
})
export class AppMapsComponent implements OnInit {
  public dataSource = new MatTableDataSource<types.MapItem>([]);
  public maps: Observable<types.MapItem[]>;
  public models: Observable<types.DeCaF.ModelHeader[]>;
  public sessionState: Observable<SessionState>;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'name',
    'model_id',
    'edit',
    'remove',
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.store.pipe(select((store) => store.shared.maps)).subscribe((maps) => {
      this.dataSource.data = maps;
    });
    this.dataSource.sort = this.sort;
    this.models = this.store.pipe(select((store) => store.shared.modelHeaders));
    this.sessionState = this.store.select('session');
  }

  removeMap(map: string): void {
    const dialogRef = this.dialog.open(RemoveMapComponent, {
      data: {
        map: map,
      },
    });

    dialogRef.afterClosed().subscribe(
      () => this.store.dispatch(new fromActions.ResetRemovedMap()));
  }

  editMap(map: types.MapItem): void {
    const dialogRef = this.dialog.open(EditMapComponent, {
      data: {
        map: map,
      },
    });

    dialogRef.afterClosed().subscribe(
      () => this.store.dispatch(new fromActions.ResetError()));
  }

  addMap(): void {
    const dialogRef = this.dialog.open(AddMapComponent);

    dialogRef.afterClosed().subscribe(
      () => this.store.dispatch(new fromActions.ResetError()));
  }

  getModelName(id: string, models: types.DeCaF.ModelHeader[]): string {
    if (models.length > 0 && id) {
      const model = models.find((m) => m.id === parseInt(id, 10));
      return model ? model.name : '';
    } else {
      return '';
    }
  }
}
