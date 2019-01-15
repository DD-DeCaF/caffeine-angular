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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { select, Store } from '@ngrx/store';

import { AppState } from '../store/app.reducers';
import {SessionState} from '../session/store/session.reducers';
import * as actions from '../store/shared.actions';
import * as types from './types';
import {Observable} from 'rxjs';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { DeleteProjectComponent } from './components/delete-project/delete-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public dataSource = new MatTableDataSource<types.Project>([]);
  public projects$: Observable<types.Project[]>;
  public sessionState$: Observable<SessionState>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = ['name', 'delete'];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new actions.FetchProjects());
    this.store.pipe(select((state) => state.shared.projects)).subscribe((projects) => {
      this.dataSource.data = projects;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sessionState$ = this.store.select('session');
  }

  create(): void {
    this.dialog.open(CreateProjectComponent);
  }

  delete(project: types.Project): void {
    this.dialog.open(DeleteProjectComponent, {
      data: project,
    });
  }
}
