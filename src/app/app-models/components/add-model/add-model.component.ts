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

import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as types from '../../../app-interactive-map/types';
import {AppState} from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddModel} from '../../store/models.actions';
import {Project, NewProjectResponse} from 'src/app/projects/types';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddedModelComponent} from './added-model.component';
import * as actions from '../../../store/shared.actions';
import {SessionService} from '../../../session/session.service';
import {IamService} from '../../../services/iam.service';
import {WarehouseService} from '../../../services/warehouse.service';
import {NewSpecies, NewSpeciesResponse} from '../../types';
import {mapItemsByModel} from '../../../app-interactive-map/store/interactive-map.selectors';
import {ModelService} from '../../../services/model.service';

@Component({
  selector: 'app-loader',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class AddModelComponent implements OnInit, OnDestroy {

  @ViewChild('newproject') newProject: ElementRef;

  public allSpecies: Observable<types.Species[]>;
  public allProjects: Observable<Project[]>;
  public model: types.DeCaF.Model;
  public models: Observable<types.DeCaF.ModelHeader[]>;
  public addModelForm: FormGroup;
  public addOrganismForm: FormGroup;
  public error: Observable<Boolean>;
  public fileType = '.json';
  public reactions: string[] = [];
  public modelError = false;
  public addedModel = false;
  public loading = false;
  public project: Project = {
    id: null,
    name: '',
  };
  public maps: Observable<{
    modelIds: string[],
    mapsByModelId: {[key: string]: types.MapItem[] },
  }>;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private session: SessionService,
    private iamService: IamService,
    private modelService: ModelService,
    private warehouseService: WarehouseService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.maps = this.store.pipe(select(mapItemsByModel));
    this.models = this.store.pipe(select((store) => store.shared.modelHeaders));
    this.error = this.store.pipe(select((store) => store.models.error));
    this.store.pipe(select((store) => store.shared.modelHeaders)).subscribe(() => {
      if (this.addedModel) {
        this.dialog.closeAll();
        this.snackBar.openFromComponent(AddedModelComponent, {
          duration: 2000,
        });
      }
    });
    this.addModelForm = this.fb.group({
      name: ['', Validators.required],
      organism_id: ['', Validators.required],
      project_id: ['', Validators.required],
      model_serialized: ['', Validators.required],
      default_biomass_reaction: ['', Validators.required],
      preferred_map_id: [null],
    });
    this.addOrganismForm = this.fb.group({
      organism_name: ['', Validators.required],
      project_id: ['', Validators.required],
    });
    this.store.pipe(
      select((store) => store.shared.selectedProject)).subscribe((project) => {
      this.addModelForm.patchValue({
        project_id: project ? project.id : null,
      });
      this.addOrganismForm.patchValue({
        project_id: project ? project.id : null,
      });
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
      const model = JSON.parse(fileReader.result as string);
      this.addModelForm.patchValue({
        model_serialized: JSON.parse(fileReader.result as string),
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
      return this.reactions.filter((s) => new RegExp(name.toLowerCase()).test(s.toLowerCase())).slice(0, 9);
    } else {
      return this.reactions.slice(0, 9);
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
          if (this.addModelForm.value.project_id === 'add') {
            this.addModelForm.patchValue({
              project_id: p.id,
            });
          } else if (this.addOrganismForm.value.project_id === 'add') {
            this.addOrganismForm.patchValue({
              project_id: p.id,
            });
          }
        },
      ),
    );
  }

  submitOrganism(): void {
    const organism: NewSpecies = {
      name: this.addOrganismForm.value.organism_name,
      project_id: this.addOrganismForm.value.project_id,
    };
    this.warehouseService.createOrganisms(organism).subscribe(
      (s: NewSpeciesResponse) => {
        this.snackBar.open(`Organism ${organism.name} created`, '', {
          duration: 2000,
        });
        this.store.dispatch(new actions.FetchSpecies());
        this.addModelForm.patchValue({
          organism_id: s.id,
        });
      },
    );
  }

  isValidProject(): boolean {
    if (this.newProject) {
      return Boolean(this.newProject.nativeElement.value);
    } else {
      return false;
    }
  }

  isValidOrganism(): boolean {
    return this.addOrganismForm.value.organism_name && this.addOrganismForm.value.project_id;
  }

  cancelProject(): void {
    if (this.addModelForm.value.project_id === 'add') {
      this.addModelForm.patchValue({
        project_id: '',
      });
    } else if (this.addOrganismForm.value.project_id === 'add') {
      this.addOrganismForm.patchValue({
        project_id: '',
      });
    }
  }

  cancelOrganism(): void {
    this.addModelForm.patchValue({
      organism_id: '',
    });
  }

  ngOnDestroy(): void {
    this.addedModel = false;
    this.loading = false;
  }

  getModel(id: string, models: types.DeCaF.ModelHeader[]): types.DeCaF.ModelHeader {
    return this.modelService.getModel(id, models);
  }
}
