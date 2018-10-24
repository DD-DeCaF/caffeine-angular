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
import * as fromActions from '../../store/models.actions';
import {EditedModelComponent} from './edited-model.component';

@Component({
  selector: 'app-loader',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss'],

})

export class EditModelComponent implements OnInit, OnDestroy {

  public allSpecies: Observable<types.Species[]>;
  public model: types.DeCaF.Model;
  public modelForm: FormGroup;
  public reactions: string[];
  public loading = true;
  public error: Observable<Boolean>;
  private edited = false;

  constructor(
    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.modelForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      organism_id: ['', Validators.required],
      default_biomass_reaction: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.model = this.data.model;
    this.store.dispatch(new fromActions.FetchModel(this.model));
    this.allSpecies = this.store.pipe(select((store) => store.models.species));
    this.error = this.store.pipe(select((store) => store.models.error));
    this.store.pipe(select((store) => store.models.model)).subscribe((model) => {
      if (model && (model.id === this.model.id)) {
        if (this.edited) {
          this.dialog.closeAll();
          this.snackBar.openFromComponent(EditedModelComponent, {
            duration: 2000,
          });
        } else {
          console.log('EDIT MODEL', model);
          this.reactions = model.model_serialized.reactions.map((reaction) => reaction.id);
          this.modelForm.setValue({
            id: model.id,
            organism_id: parseInt(model.organism_id, 10),
            name: model.name,
            default_biomass_reaction: model.default_biomass_reaction,
          });
          this.loading = false;
        }
      }
    });
  }

  filterReactions(name: string): string[] {
    if (name) {
      return this.reactions.filter((s) => new RegExp(name.toLowerCase()).test(s.toLowerCase()));
    } else {
      return this.reactions;
    }
  }

  onSubmit(): void {
    this.store.dispatch(new fromActions.EditModel(this.modelForm.value));
    this.loading = true;
    this.edited = true;
  }

  ngOnDestroy(): void {
    this.edited = false;
  }
}

