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
import * as fromActions from './store/models.actions';
import * as types from '../app-interactive-map/types';
import {Observable} from 'rxjs';
import {EditModelComponent} from './components/edit-model/edit-model.component';
import {RemoveModelComponent} from './components/remove-model/remove-model.component';
import {AddModelComponent} from './components/add-model/add-model.component';

@Component({
  selector: 'app-models',
  templateUrl: './app-models.component.html',
  styleUrls: ['./app-models.component.scss'],
})
export class AppModelsComponent implements OnInit {
  public dataSource = new MatTableDataSource<types.DeCaF.ModelHeader>([]);
  public models: Observable<types.DeCaF.ModelHeader[]>;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'edit',
    'remove',
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.store.pipe(select((store) => store.shared.modelHeaders)).subscribe((models) => {
      this.dataSource.data = models;
    });
    this.dataSource.sort = this.sort;
  }

  removeModel(model: string): void {
    const dialogRef = this.dialog.open(RemoveModelComponent, {
      data: {
        model: model,
      },
    });

    dialogRef.afterClosed().subscribe(
      () => this.store.dispatch(new fromActions.ResetRemovedModel()));
  }

  editModel(model: types.DeCaF.Model): void {
    const dialogRef = this.dialog.open(EditModelComponent, {
      data: {
        model: model,
      },
    });

    dialogRef.afterClosed().subscribe(
      () => this.store.dispatch(new fromActions.ResetError()));
  }

  addModel(): void {
    const dialogRef = this.dialog.open(AddModelComponent);

    dialogRef.afterClosed().subscribe(
      () => this.store.dispatch(new fromActions.ResetError()));
  }
}
