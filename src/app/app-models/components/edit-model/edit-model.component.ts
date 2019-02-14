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
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as fromActions from '../../store/models.actions';
import {EditedModelComponent} from './edited-model.component';
import {mapItemsByModel} from '../../../app-interactive-map/store/interactive-map.selectors';
import {ModelService} from '../../../services/model.service';

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
  public maps: Observable<{
    modelIds: string[],
    mapsByModelId: {[key: string]: types.MapItem[] },
  }>;
  public models: Observable<types.DeCaF.ModelHeader[]>;
  public completeModel: types.DeCaF.Model;
  private modelSubscription: Subscription;
  private modelHeadersSubscription: Subscription;

  constructor(
    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private modelService: ModelService,
    public snackBar: MatSnackBar) {
    this.modelForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      organism_id: ['', Validators.required],
      default_biomass_reaction: ['', Validators.required],
      preferred_map_id: [''],
    });
  }

  ngOnInit(): void {
    this.model = this.data.model;
    this.store.dispatch(new fromActions.FetchModel(this.model));
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.maps = this.store.pipe(select(mapItemsByModel));
    this.models = this.store.pipe(select((store) => store.shared.modelHeaders));
    this.error = this.store.pipe(select((store) => store.models.error));
    this.modelSubscription = this.store.pipe(select((store) => store.models.model)).subscribe((model) => {
      this.completeModel = model;

      if (model && (model.id === this.model.id) && !this.edited) {
          this.reactions = model.model_serialized.reactions.map((reaction) => reaction.id);
          this.modelForm.setValue({
            id: model.id,
            organism_id: model.organism_id,
            name: model.name,
            default_biomass_reaction: model.default_biomass_reaction,
            preferred_map_id: model.preferred_map_id,

          });
          this.loading = false;
      }
    });

    this.modelHeadersSubscription = this.store.pipe(select((store) => store.shared.modelHeaders)).subscribe(() => {
      if (this.edited) {
        this.dialog.closeAll();
        this.snackBar.openFromComponent(EditedModelComponent, {
          duration: 2000,
        });
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
    this.completeModel.name = this.modelForm.value.name;
    this.completeModel.organism_id = this.modelForm.value.organism_id;
    this.completeModel.default_biomass_reaction = this.modelForm.value.default_biomass_reaction;
    this.completeModel.preferred_map_id = this.modelForm.value.preferred_map_id;
    this.store.dispatch(new fromActions.EditModel(this.completeModel));
    this.loading = true;
    this.edited = true;
  }

  ngOnDestroy(): void {
    this.edited = false;
    this.modelSubscription.unsubscribe();
    this.modelHeadersSubscription.unsubscribe();
  }

  getModel(id: string, models: types.DeCaF.ModelHeader[]): types.DeCaF.ModelHeader {
    return this.modelService.getModel(id, models);
  }
}
