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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {async, ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {MatSidenav} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';

import {AppMaterialModule} from '../app-material.module';
import {AppToolbarComponent} from './app-toolbar.component';
import {reducers} from '../store/app.reducers';
import {SessionService} from '../session/session.service';

describe('AppToolbarComponent', () => {
  let component: AppToolbarComponent;
  let fixture: ComponentFixture<AppToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        AppMaterialModule,
        HttpClientModule,
        StoreModule.forRoot(reducers),
      ],
      declarations: [AppToolbarComponent],
      providers: [
        SessionService,
        HttpClient,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppToolbarComponent);
    component = fixture.componentInstance;
    const element: ComponentFixture<MatSidenav> = getTestBed().createComponent(MatSidenav);
    component.sidenav = element.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should close sidenav on click', async(() => {
    const button = fixture.debugElement.nativeElement.querySelector('button[role="menuButton"]');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.sidenav.opened).toBeTruthy();
    });
  }));
});
