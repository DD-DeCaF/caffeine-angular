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
import {Observable} from 'rxjs';
import {SessionState} from '../session/store/session.reducers';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {Project} from '../projects/types';
import {SetSelectedProject} from '../store/shared.actions';
import {selectNotNull} from '../framework-extensions';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit {
  public sessionState: Observable<SessionState>;
  public allProjects: Observable<Project[]>;
  public selectedProject: number;

  public title = 'app';

  constructor(
    private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.store.pipe(
      selectNotNull((store) => store.shared.selectedProject)).subscribe((project) => {
      this.selectedProject = project.id;
    });
    this.sessionState = this.store.select('session');
  }

  selectProject(project: Project): void {
    this.store.dispatch(new SetSelectedProject(project));
  }
}
