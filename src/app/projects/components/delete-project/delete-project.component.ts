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

import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as types from '../../../app-interactive-map/types';
import * as actions from '../../../store/shared.actions';
import { AppState } from '../../../store/app.reducers';
import { Project } from '../../types';
import { SessionService } from '../../../session/session.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss'],
})

export class DeleteProjectComponent {

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<DeleteProjectComponent>,
    public snackBar: MatSnackBar,
    private session: SessionService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public project: Project
  ) {}

  submit() {
    this.dialogRef.close();

    this.http.delete(`${environment.apis.iam}/projects/${this.project.id}`).subscribe(
      // Refresh the token to include the newly created project when fetching new projects
      () => this.session.refresh().subscribe(
        () => {
          this.snackBar.open(`Project deleted`, '', {
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
