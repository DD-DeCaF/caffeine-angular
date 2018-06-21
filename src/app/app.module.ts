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

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { FlexLayoutModule } from '@angular/flex-layout';

import {AppComponent} from './app.component';
import {AppHomeComponent} from './app-home/app-home.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';
import {LoginComponent} from './app-login/app-login.component';

import {AppMaterialModule} from './app-material.module';
// import {SessionModule} from './session/session.module';
import {AppRoutingModule} from './app-routing.module';

import {AppAuthService} from './app-auth.service';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';
import {reducers} from './store/app.reducers';
import { SessionService } from './session/session.service';

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppHomeComponent,
    AppWelcomeComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    // SessionModule,
    AppMaterialModule,
    StoreModule.forRoot(reducers),
  ],
  providers: [
    AppAuthService,
    SessionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
