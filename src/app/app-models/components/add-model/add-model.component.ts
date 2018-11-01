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

import {Component, OnDestroy, OnInit} from '@angular/core';
import * as types from '../../../app-interactive-map/types';
import {AppState} from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddModel} from '../../store/models.actions';
import {Project} from 'src/app/projects/types';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddedModelComponent} from './added-model.component';

@Component({
  selector: 'app-loader',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],

})

export class AddModelComponent implements OnInit, OnDestroy {

  public allSpecies: Observable<types.Species[]>;
  public allProjects: Observable<Project[]>;
  public model: types.DeCaF.Model;
  public addModelForm: FormGroup;
  public error: Observable<Boolean>;
  public fileType = '.json';
  public reactions: string[] = [];
  public modelError = false;
  public addedModel = false;
  public loading = false;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.addModelForm = this.fb.group({
      name: ['', Validators.required],
      organism_id: ['', Validators.required],
      project_id: ['', Validators.required],
      model_serialized: ['', Validators.required],
      default_biomass_reaction: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.error = this.store.pipe(select((store) => store.models.error));
    this.store.pipe(select((store) => store.shared.modelHeaders)).subscribe(() => {
        if (this.addedModel) {
          this.dialog.closeAll();
          this.snackBar.openFromComponent(AddedModelComponent, {
            duration: 2000,
          });
        }
    });
  }

  onSubmit(): void {
    this.store.dispatch(new AddModel(this.addModelForm.value));
    this.addedModel = true;
    this.loading = true;
  }

  // tslint:disable-next-line:no-any
  fileChange(event: any): void {
    if (event.target.files) {
      const fileList: FileList = event.target.files;
      const file: File = fileList[0];
      this.fileUploaded(file);
    }
  }

  fileUploaded(file: File): void {
    const fileReader = new FileReader(); // New instance fileReader
    fileReader.onload = () => {  // Called when a read operation successfully completes
      const model = JSON.parse(fileReader.result);
      this.addModelForm.patchValue({
        model_serialized: JSON.parse(fileReader.result),
      });
      if (model.reactions) {
        this.modelError = false;
        this.reactions = model.reactions.map((reaction) => reaction.id);
      } else {
        this.modelError = true;
      }
    };
    if (file) {
      fileReader.readAsText(file); // For stored the file in this.data after the 'load' event fires
    }
  }

  filterReactions(name: string): string[] {
    if (name) {
      return this.reactions.filter((s) => new RegExp(name.toLowerCase()).test(s.toLowerCase()));
    } else {
      return this.reactions;
    }
  }

  ngOnDestroy(): void {
    this.addedModel = false;
    this.loading = false;
  }
}

