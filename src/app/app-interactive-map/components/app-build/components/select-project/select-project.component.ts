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

import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../../../../store/app.reducers';
import {Project} from '../../../../../projects/types';
import {SetSelectedProject} from '../../../../../store/shared.actions';

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.scss'],
})

export class SelectProjectComponent implements OnInit {

  public allProjects: Observable<Project[]>;

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<SelectProjectComponent>,
  ) {}

  ngOnInit(): void {
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
  }

  selectProject(project: Project): void {
    this.store.dispatch(new SetSelectedProject(project));
    this.dialogRef.close(project.id);
  }
}
