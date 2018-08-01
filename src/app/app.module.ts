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

import * as Raven from 'raven-js';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, ErrorHandler} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder} from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {AppHomeComponent} from './app-home/app-home.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';
import {AppWelcomeContentComponent} from './app-welcome/app-welcome.content';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';
import {AppLoginDialogComponent} from './app-login-dialog/app-login-dialog.component';
import {AppInteractiveMapComponent} from './app-interactive-map/app-interactive-map.component';
import {AppBuildComponent} from './app-interactive-map/components/app-build/app-build.component';
import {AppNotFoundComponent} from './app-not-found/app-not-found.component';

import {AppMaterialModule} from './app-material.module';
import {AppRoutingModule} from './app-routing.module';

import {CallbackPipe} from './callback.pipe';

import {reducers} from './store/app.reducers';
import {SessionService} from './session/session.service';
import {OpenLoginDialogDirective} from './session/open-login-dialog.directive';

import {environment} from '../environments/environment';

if (environment.sentry) {
  Raven
    .config(environment.sentry.DSN, {
      release: environment.sentry.release,
    })
    .install();
}

export class RavenErrorHandler implements ErrorHandler {
  // tslint:disable-next-line:no-any
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

@NgModule({
  declarations: [
    CallbackPipe,
    AppComponent,
    AppToolbarComponent,
    AppHomeComponent,
    AppWelcomeComponent,
    AppWelcomeContentComponent,
    AppLoginDialogComponent,
    AppInteractiveMapComponent,
    AppBuildComponent,
    OpenLoginDialogDirective,
    AppNotFoundComponent,
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

    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    SessionService,
    FormBuilder,
    ...(environment.sentry ? [{ provide: ErrorHandler, useClass: RavenErrorHandler }] : []),
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppLoginDialogComponent],
})
export class AppModule { }
