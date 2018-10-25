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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';

import { AppState } from '../store/app.reducers';
import * as actions from './store/projects.actions';
import * as types from './types';
import { CreateProjectComponent } from './components/create-project/create-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private projects$;
  displayedColumns = ['name', 'edit', 'delete'];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.store.dispatch(new actions.FetchProjects());
    this.projects$ = this.store.pipe(select((state) => state.projects.projects));
  }

  create() {
    const dialogRef = this.dialog.open(CreateProjectComponent);
    // dialogRef.afterClosed().subscribe(() => this.store.dispatch(new fromActions.ResetError()));
  }

  edit(project: types.Project) {
    // TBD
  }

  delete(project: types.Project) {
    // TBD
  }
}
