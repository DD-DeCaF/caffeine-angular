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

import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {AppState} from '../../../../../store/app.reducers';
import {SaveDesign} from '../../../../store/interactive-map.actions';
import {SelectProjectComponent} from '../select-project/select-project.component';
import {HydratedCard} from '../../../../types';

@Component({
  selector: 'app-remove-model',
  templateUrl: './warning-save.component.html',
  styleUrls: ['./warning-save.component.scss'],
})
export class WarningSaveComponent implements OnInit {
  @ViewChild('newname') newName: ElementRef;

  public error: Observable<Boolean>;
  public design: HydratedCard;
  public projectId: number;
  public changeName = false;
  constructor(
    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.design = this.data.design;
    this.projectId = this.data.projectId;
  }

  saveDesign(): void {
    this.design.name = this.newName.nativeElement.value;
    if (this.projectId) {
      this.store.dispatch(new SaveDesign(this.design, this.projectId));
    } else {
      const dialogRef = this.dialog.open(SelectProjectComponent);
      dialogRef.afterClosed().subscribe(
        (id) => {
          if (id) {
            this.store.dispatch(new SaveDesign(this.design, id));
          }
        });
    }
  }

  close(): void {
    this.dialog.closeAll();
  }

}
