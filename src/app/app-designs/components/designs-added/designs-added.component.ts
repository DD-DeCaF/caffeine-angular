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

import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';

import { AppState } from '../../../store/app.reducers';
import {DesignRequest} from '../../types';
import {Router} from '@angular/router';

@Component({
  preserveWhitespaces: true,
  selector: 'app-delete-project',
  templateUrl: './designs-added.component.html',
  styleUrls: ['./designs-added.component.scss'],
})

export class DesignsAddedComponent {

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<DesignsAddedComponent>,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public design: DesignRequest,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  goToInteractiveMap(): void {
    this.router.navigateByUrl(`/interactiveMap`);
  }
}
