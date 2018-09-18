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

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import * as fromInteractiveMapActions from '../app-interactive-map/store/interactive-map.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-design-tool',
  templateUrl: './design-tool.component.html',
  styleUrls: ['./design-tool.component.scss'],
})
export class DesignToolComponent implements OnInit {

  public designForm: FormGroup;
  public designStarted: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
  ) {
    this.designForm = this.fb.group({
      organism: ['', Validators.required],
      product: ['', Validators.required],
      databases: [''],
      model: [''],
      number_pathways: [''],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new fromInteractiveMapActions.FetchSpecies());
    this.designStarted = this.store.pipe(select((store) => store.designTool.designStarted));
  }

}
