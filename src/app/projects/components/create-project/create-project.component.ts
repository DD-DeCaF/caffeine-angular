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

import {ChangeDetectionStrategy, Component} from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';

import * as actions from '../../../store/shared.actions';
import { AppState } from '../../../store/app.reducers';
import { Project } from '../../types';
import { SessionService } from '../../../session/session.service';
import {IamService} from '../../../services/iam.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CreateProjectComponent {
  public project: Project = {
    id: null,
    name: '',
  };

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<CreateProjectComponent>,
    public snackBar: MatSnackBar,
    private session: SessionService,
    private iamService: IamService,
  ) {}

  submit(): void {
    this.dialogRef.close();

    this.iamService.createProject(this.project).subscribe(
      // Refresh the token to include the newly created project when fetching new projects
      () => this.session.refresh().subscribe(
        () => {
          this.snackBar.open(`Project ${this.project.name} created`, '', {
            duration: 2000,
          });
          this.store.dispatch(new actions.FetchProjects());
        },
      ),
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
