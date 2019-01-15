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
import { Store } from '@ngrx/store';

import * as actions from '../../../store/shared.actions';
import { AppState } from '../../../store/app.reducers';
import { SessionService } from '../../../session/session.service';
import { environment } from '../../../../environments/environment';
import {DesignRequest} from '../../types';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-design.component.html',
  styleUrls: ['./delete-design.component.scss'],
})

export class DeleteDesignComponent {

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<DeleteDesignComponent>,
    public snackBar: MatSnackBar,
    private session: SessionService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public designs: DesignRequest[],
  ) {}

  submit(): void {
    const urls = [];
    this.dialogRef.close();
    for (let i = 0; i < this.designs.length; i++) {
      urls.push(this.http.delete(`${environment.apis.design_storage}/designs/${this.designs[i].id}`));
    }
    forkJoin(urls).subscribe(() => this.session.refresh().subscribe(
      () => {
        this.snackBar.open(`Designs deleted`, '', {
          duration: 2000,
        });
        this.store.dispatch(new actions.FetchDesigns());
      }));
  }

  close(): void {
    this.dialogRef.close();
  }
}
