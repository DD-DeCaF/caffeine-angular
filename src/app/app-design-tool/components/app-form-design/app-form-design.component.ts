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
import {MatButton, MatSelect} from '@angular/material';
import * as types from '../../../app-interactive-map/types';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import { NgForm } from '@angular/forms';
import {FetchModelsDesign, FetchSpeciesDesign} from '../../store/design-tool.actions';
import {activeModels} from '../../store/design-tool.selectors';


@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  @ViewChild('designForm') designForm: NgForm;
  subscription: Subscription;
  @ViewChild('advanced') advancedButton: MatButton;
  @ViewChild('design') designButton: MatButton;

  @Input() sidenav: boolean;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;
  public collapsed = true;
  public options: string[] = ['One', 'Two', 'Three'];
  public selectedModel: Observable<types.DeCaF.Model>;
  public models: Observable<types.DeCaF.Model[]>;

  constructor(
    private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchSpeciesDesign());
    this.store.dispatch(new FetchModelsDesign());
    /* Just to make it works, I am going to change it for a new store*/
    this.allSpecies = this.store.pipe(select((store) => store.designTool.allSpecies));
    this.models = this.store.pipe(select(activeModels));

    this.subscription = this.store.select('designTool')
      .subscribe(
        (data) => {
          if (data.selectedSpecies) {
            this.designForm.setValue({
              species: data.selectedSpecies,
              product: 'One',
            });
          }
        },
      );
  }

  ngAfterViewInit(): void {
    fromEvent(this.advancedButton._elementRef.nativeElement, 'click').subscribe(() => this.collapsed = this.collapsed !== true);
    fromEvent(this.designButton._elementRef.nativeElement, 'click').subscribe(() => console.log('DESIGN BUTTON', this.designForm.value));
  }
}
