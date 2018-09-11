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
import {MatButton} from '@angular/material';
import * as types from '../../../app-interactive-map/types';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {NgForm} from '@angular/forms';
import {FetchModelsDesign, FetchSpeciesDesign, StartDesign} from '../../store/design-tool.actions';
import {activeModels} from '../../store/design-tool.selectors';
import * as typesDesign from '../../types';


@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  @ViewChild('designForm') designForm: NgForm;
  subscription: Subscription;
  @ViewChild('design') designButton: MatButton;

  @Input() sidenav: boolean;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;

  public options: typesDesign.Product[] = [ {'name': 'menaquinol-10', 'id': 'menaquinol-10'}, {
    'name': '2,6,10,14-tetramethylpentadecanal',
    'id': '2,6,10,14-tetramethylpentadecanal',
  }, {
    'name': 'alpha-N-acetylneuraminyl-(2->3)-beta-D-galactosyl-(1->3)-N-acetyl-alpha-D-galactosaminyl group',
    'id': 'alpha-N-acetylneuraminyl-(2->3)-beta-D-galactosyl-(1->3)-N-acetyl-alpha-D-galactosaminyl group',
  }, {'name': '3-oxododecanoyl-CoA', 'id': '3-oxododecanoyl-CoA'}];

  public selectedModel: Observable<types.DeCaF.Model>;
  public models: Observable<types.DeCaF.Model[]>;

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchSpeciesDesign());
    this.store.dispatch(new FetchModelsDesign());
    /* Just to make it works, I am going to change it for a new store*/
    this.allSpecies = this.store.pipe(select((store) => store.designTool.allSpecies));


    this.models = this.store.pipe(select(activeModels));

    this.subscription = this.store.select('designTool')
      .subscribe(
        (data) => {
          console.log('DTA', data);
           if (data.selectedSpecies) {
            this.designForm.setValue({
              species: data.selectedSpecies,
              product: {
                'name': 'trans-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
                'id': 'trans-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
              },
              bigg: false,
              kegg: false,
              rhea: false,
              model: {},
              number_pathways: 10,
            });
          }
        },
      );
  }

  ngAfterViewInit(): void {
  }

  // tslint:disable-next-line:no-any
  displayFn(item: any): string {
    return item ? item.name : '';
  }

  onSubmit(): void {
    this.store.dispatch(new StartDesign(this.designForm.value));
  }
}
