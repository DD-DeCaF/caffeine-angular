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

import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatSelect, MatSelectChange, MatAutocomplete} from '@angular/material';
import * as types from '../../../app-interactive-map/types';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  InitDesign, SetModelDesign,
  SetSelectedSpeciesDesign,
  StartDesign,
} from '../../store/design-tool.actions';
import {activeModels} from '../../store/design-tool.selectors';
import * as typesDesign from '../../types';
import {Project} from '../../../projects/types';
import {debounceTime, switchMap} from 'rxjs/operators';
import {WarehouseService} from '../../../services/warehouse.service';


@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  designForm: FormGroup;
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('auto') productSelector: MatAutocomplete;
  @ViewChild('projects') projectSelector: MatSelect;
  @ViewChild('model') modelSelector: MatSelect;
  subscription: Subscription;
  @ViewChild('design') designButton: MatButton;

  @Input() gridView: boolean;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;

  public products: Observable<typesDesign.Product[]>;

  public models: Observable<types.DeCaF.ModelHeader[]>;
  public allProjects: Observable<Project[]>;
  public product_placeholder = 'vanillate';

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private warehouseService: WarehouseService) {
    this.designForm = this.fb.group({
      species: ['', Validators.required],
      product: ['', Validators.required],
      project_id: ['', Validators.required],
      bigg: [true],
      rhea: [true],
      model: [''],
      max_predictions: [10],
      aerobic: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new InitDesign());

    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.selectedSpecies = this.store.pipe(select((store) => store.designTool.selectedSpecies));

    this.models = this.store.pipe(select(activeModels));

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
    this.store.dispatch(new StartDesign(this.designForm.value));
  }
}
