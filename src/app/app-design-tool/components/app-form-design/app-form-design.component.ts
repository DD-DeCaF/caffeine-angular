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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatSelect} from '@angular/material';
import {Species} from '../../../app-interactive-map/types';
import {fromEvent, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  @ViewChild('species') speciesSelector: MatSelect;
  @ViewChild('advanced') advancedButton: MatButton;
  @ViewChild('design') designButton: MatButton;

  public designForm: FormGroup;
  public selectedSpecies: Observable<string>;
  public allSpecies: Observable<Species[]>;
  public submited = false;
  public collapsed = true;
  public options: string[] = ['One', 'Two', 'Three'];

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder) {
    this.designForm = this.fb.group({
      species: ['', Validators.required],
      product: ['', Validators.required],
      bigg: [''],
      kegg: [''],
      rhea: [''],
      model: [''],
      number_pathways: [10],
    });
  }

  ngOnInit(): void {
    /* Just to make it works, I am going to change it for a new store*/
    this.selectedSpecies = this.store.select((store) => store.interactiveMap.selectedSpecies);
    this.allSpecies = this.store.select((store) => store.interactiveMap.allSpecies);
  }

  ngAfterViewInit(): void {
    fromEvent(this.advancedButton._elementRef.nativeElement, 'click').subscribe(() => this.collapsed = this.collapsed !== true);
    fromEvent(this.designButton._elementRef.nativeElement, 'click').subscribe(() => console.log(this.designForm));

  }

  submit(): void {
    this.submited = true;
  }
}
