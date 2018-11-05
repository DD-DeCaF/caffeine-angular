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
import {Router} from '@angular/router';
import {MatButton, MatSelect, MatSelectChange} from '@angular/material';
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
import {selectNotNull} from '../../../framework-extensions';
import {withLatestFrom} from 'rxjs/operators';


@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  designForm: FormGroup;
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('model') modelSelector: MatSelect;
  subscription: Subscription;
  @ViewChild('design') designButton: MatButton;

  @Input() gridView: boolean;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;

  public products: Observable<typesDesign.Product[]>;

  public selectedModel: Observable<types.DeCaF.ModelHeader>;
  public models: Observable<types.DeCaF.ModelHeader[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router) {
    this.designForm = this.fb.group({
      species: ['', Validators.required],
      product: ['', Validators.required],
      bigg: [''],
      kegg: [''],
      rhea: [''],
      model: [''],
      number_pathways: [''],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new InitDesign());

    /* Just to make it works, I am going to change it for a new store*/
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));

    this.products = this.store.pipe(select((store) => store.designTool.products));

    this.selectedModel = this.store.pipe(select((store) => store.designTool.selectedModel));
    this.models = this.store.pipe(select(activeModels));

    this.subscription = this.store.select('designTool')
      .subscribe(
        (data) => {
           if (data.selectedSpecies) {
            this.designForm.setValue({
              species: data.selectedSpecies,
              product: {
                name: 'vanillin',
                id: '5',
              },
              bigg: false,
              kegg: false,
              rhea: false,
              model: data.selectedModel,
              number_pathways: 10,
            });
          }
        },
      );
  }

  ngAfterViewInit(): void {
    this.speciesSelector.selectionChange
      .subscribe((change: MatSelectChange) => {
        this.store.dispatch(new SetSelectedSpeciesDesign(change.value));
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
    this.store.pipe(
      selectNotNull((store) => store.designTool.lastJobId),
    ).subscribe((id) => {
      this.router.navigateByUrl(`/jobs/${id}`);
    });
  }
}
