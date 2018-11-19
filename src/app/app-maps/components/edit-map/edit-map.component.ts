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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import * as types from '../../../app-interactive-map/types';
import {AppState} from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fromActions from '../../store/maps.actions';
import {EditedMapComponent} from './edited-map.component';
import {Project} from '../../../projects/types';

@Component({
  selector: 'app-loader',
  templateUrl: './edit-map.component.html',
  styleUrls: ['./edit-map.component.scss'],

})

export class EditMapComponent implements OnInit, OnDestroy {

  public map: types.MapItem;
  public mapForm: FormGroup;
  public loading = true;
  public error: Observable<Boolean>;
  public edited = false;
  public allProjects: Observable<Project[]>;
  public models: Observable<types.DeCaF.ModelHeader[]>;

  constructor(
    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.mapForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      model_id: ['', Validators.required],
      project_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.map = this.data.map;
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.models = this.store.pipe(select((store) => store.shared.modelHeaders));
    this.error = this.store.pipe(select((store) => store.maps.error));
    this.mapForm.setValue({
      id: this.map.id,
      name: this.map.name,
      model_id: this.map.model_id,
      project_id: this.map.project_id,
    });
    this.loading = false;
    this.store.pipe(select((store) => store.shared.maps)).subscribe(() => {
      if (this.edited) {
        this.dialog.closeAll();
        this.snackBar.openFromComponent(EditedMapComponent, {
          duration: 2000,
        });
      }
    });
  }

  onSubmit(): void {
    this.store.dispatch(new fromActions.EditMap(this.mapForm.value));
    this.loading = true;
    this.edited = true;
  }

  ngOnDestroy(): void {
    this.edited = false;
  }
}

