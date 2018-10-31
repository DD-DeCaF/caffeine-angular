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

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as types from '../../../app-interactive-map/types';
import * as actions from '../../../store/shared.actions';
import { AppState } from '../../../store/app.reducers';
import { Project } from '../../types';
import { SessionService } from '../../../session/session.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})

export class CreateProjectComponent {
  private project: Project = {
    id: null,
    name: ""
  };

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<CreateProjectComponent>,
    public snackBar: MatSnackBar,
    private session: SessionService,
    private http: HttpClient,
  ) {}

  submit() {
    this.dialogRef.close();

    this.http.post(`${environment.apis.iam}/projects`, this.project).subscribe(
      // Refresh the token to include the newly created project when fetching new projects
      () => this.session.refresh().subscribe(
        () => {
          this.snackBar.open(`Project ${this.project.name} created`, '', {
            duration: 2000,
          });
          this.store.dispatch(new actions.FetchProjects());
        }
      )
    );
  }

  close() {
    this.dialogRef.close();
  }
}
