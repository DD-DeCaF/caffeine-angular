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

import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatSelect, MatSelectChange, MatAutocomplete, MatSnackBar} from '@angular/material';
import * as types from '../../../app-interactive-map/types';
import {combineLatest, Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  InitDesign, SelectFirstModel, SetModelDesign,
  SetSelectedSpeciesDesign,
  StartDesign,
} from '../../store/design-tool.actions';
import {activeModels} from '../../store/design-tool.selectors';
import * as typesDesign from '../../types';
import {Project} from '../../../projects/types';
import {debounceTime, switchMap} from 'rxjs/operators';
import {WarehouseService} from '../../../services/warehouse.service';
import * as actions from '../../../store/shared.actions';
import {SessionService} from '../../../session/session.service';
import {IamService} from '../../../services/iam.service';


@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  designForm: FormGroup;
  buttonClicked = false;
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('auto') productSelector: MatAutocomplete;
  @ViewChild('projects') projectSelector: MatSelect;
  @ViewChild('model') modelSelector: MatSelect;
  @ViewChild('newproject') newProject: ElementRef;
  @ViewChild('design') designButton: MatButton;

  @Input() gridView: boolean;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;

  public products: Observable<typesDesign.Product[]>;

  public models: Observable<types.DeCaF.ModelHeader[]>;
  public allProjects: Observable<Project[]>;
  public selectedProject: number;
  public product_placeholder = 'e.g. vanillate';

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private warehouseService: WarehouseService,
    private session: SessionService,
    private iamService: IamService,
    public snackBar: MatSnackBar) {

    this.designForm = this.fb.group({
      species: ['', Validators.required],
      product: ['', Validators.required],
      project_id: ['', Validators.required],
      bigg: [true],
      rhea: [true],
      model: [''],
      max_predictions: [3],
      aerobic: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new InitDesign());

    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.selectedSpecies = this.store.pipe(select((store) => store.designTool.selectedSpecies));
    this.store.pipe(
      select((store) => store.shared.selectedProject)).subscribe((project) => {
      this.designForm.patchValue({
        project_id: project ? project.id : null,
      });
    });
    this.models = this.store.pipe(select(activeModels));

    combineLatest(this.selectedSpecies, this.models).subscribe(([species, models]) => {
      if (species && models) {
        this.store.dispatch(new SelectFirstModel(species, models));
      }
    });
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.store.pipe(select((store) => store.designTool.selectedModel)).subscribe((selectedModel) => {
      this.designForm.patchValue({
        model: selectedModel,
      });
    });
    this.products = this.designForm
      .get('product')
      .valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value) => this.warehouseService.getProducts(value)));

    this.designForm.valueChanges
      .subscribe(() => this.buttonClicked = false);
  }

  ngAfterViewInit(): void {
    this.speciesSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.speciesSelector.placeholder = null;
        this.store.dispatch(new SetSelectedSpeciesDesign(change.value));
      });

    this.projectSelector.selectionChange
      .subscribe(() => {
        this.projectSelector.placeholder = null;
      });

    this.productSelector.optionSelected
      .subscribe(() => {
        this.product_placeholder = null;
      });

    this.modelSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.store.dispatch(new SetModelDesign(change.value));
      });
  }

  // tslint:disable-next-line:no-any
  displayFn(item: any): string {
    return item ? item.name : '';
  }

  onSubmit(): void {
    this.buttonClicked = !this.buttonClicked;
    this.store.dispatch(new StartDesign(this.designForm.value));
  }

  submitProject(): void {
    const project = {
      id: null,
      name: this.newProject.nativeElement.value,
    };
    this.iamService.createProject(project).subscribe(
      // Refresh the token to include the newly created project when fetching new projects
      () => this.session.refresh().subscribe(
        () => {
          this.snackBar.open(`Project ${project.name} created`, '', {
            duration: 2000,
          });
          this.store.dispatch(new actions.FetchProjects());
          this.store.pipe(select((store) => store.shared.projects)).subscribe((projects) => {
            this.designForm.patchValue({
              project_id: projects.slice(-1).pop().id,
            });
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
    this.designForm.patchValue({
      project_id: '',
    });
  }
}
