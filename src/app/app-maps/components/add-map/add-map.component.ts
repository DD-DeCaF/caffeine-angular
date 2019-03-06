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

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as types from '../../../app-interactive-map/types';
import {AppState} from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewProjectResponse, Project} from 'src/app/projects/types';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddedMapComponent} from './added-map.component';
import * as actions from '../../../store/shared.actions';
import {SessionService} from '../../../session/session.service';
import {AddMap} from '../../store/maps.actions';
import {IamService} from '../../../services/iam.service';

@Component({
  selector: 'app-loader',
  templateUrl: './add-map.component.html',
  styleUrls: ['./add-map.component.scss'],

})

export class AddMapComponent implements OnInit, OnDestroy {

  @ViewChild('newproject') newProject: ElementRef;

  public allProjects: Observable<Project[]>;
  public models: Observable<types.DeCaF.ModelHeader[]>;
  public addMapForm: FormGroup;
  public error: Observable<Boolean>;
  public fileType = '.json';
  public reactions: string[] = [];
  public addedMap = false;
  public loading: Observable<Boolean>;
  public project: Project = {
    id: null,
    name: '',
  };

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private session: SessionService,
    private iamService: IamService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.models = this.store.pipe(select((store) => store.shared.modelHeaders));
    this.error = this.store.pipe(select((store) => store.maps.error));
    this.loading = this.store.pipe(select((store) => store.maps.loading));
    this.store.pipe(select((store) => store.shared.maps)).subscribe(() => {
      if (this.addedMap) {
        this.dialog.closeAll();
        this.snackBar.openFromComponent(AddedMapComponent, {
          duration: 2000,
        });
      }
    });
    this.addMapForm = this.fb.group({
      name: ['', Validators.required],
      model_id: ['', Validators.required],
      project_id: ['', Validators.required],
      map: ['', Validators.required],
    });
    this.store.pipe(
      select((store) => store.shared.selectedProject)).subscribe((project) => {
      this.addMapForm.patchValue({
        project_id: project ? project.id : null,
      });
    });
  }

  onSubmit(): void {
    this.store.dispatch(new AddMap(this.addMapForm.value));
    this.addedMap = true;
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
      this.addMapForm.patchValue({
        map: JSON.parse(fileReader.result as string),
      });
    };
    if (file) {
      fileReader.readAsText(file); // For stored the file in this.data after the 'load' event fires
    }
  }

  submitProject(): void {
    const project = {
      id: null,
      name: this.newProject.nativeElement.value,
    };
    this.iamService.createProject(project).subscribe(
      // Refresh the token to include the newly created project when fetching new projects
      (p: NewProjectResponse) => this.session.refresh().subscribe(
        () => {
          this.snackBar.open(`Project ${project.name} created`, '', {
            duration: 2000,
          });
          this.store.dispatch(new actions.FetchProjects());
          this.addMapForm.patchValue({
            project_id: p.project_id,
          });
        },
      ),
    );
  }

  isValidProject(): boolean {
    if (this.newProject) {
      return Boolean(this.newProject.nativeElement.value);
    } else {
      return false;
    }
  }

  cancelProject(): void {
    this.addMapForm.patchValue({
      project_id: '',
    });
  }

  ngOnDestroy(): void {
    this.addedMap = false;
  }
}

