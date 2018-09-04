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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../../../../store/app.reducers';
import { AppMaterialModule } from '../../../../../app-material.module';

import { AppObjectiveComponent } from './app-objective.component';
import { initialState } from '../../mock-initial-state';
import {HttpClientModule} from '@angular/common/http';
import { AppPanelComponent } from '../app-panel/app-panel.component';
import { AppObjectiveDetailComponent } from '../app-objective-detail/app-objective-detail.component';
import { emptyCard } from '../../../../store/interactive-map.reducers';

describe('AppObjectiveComponent', () => {
  let component: AppObjectiveComponent;
  let fixture: ComponentFixture<AppObjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {initialState}),
        HttpClientModule,
      ],
      declarations: [
        AppObjectiveComponent,
        AppPanelComponent,
        AppObjectiveDetailComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppObjectiveComponent);
    component = fixture.componentInstance;
    // TODO make this test available in the whole IM module.
    component.card = {
      ...emptyCard,
      selected: false,
      id: '0',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
