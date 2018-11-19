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
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder} from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CallbackPipe} from './pipes/callback.pipe';
import {AppComponent} from './app.component';
import {AppHomeComponent} from './app-home/app-home.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';
import {AppWelcomeContentComponent} from './app-welcome/app-welcome.content';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';
import {AppLoginDialogComponent} from './app-login-dialog/app-login-dialog.component';
import {AppNotFoundComponent} from './app-not-found/app-not-found.component';
import {AppMaterialModule} from './app-material.module';
import {AppRoutingModule} from './app-routing.module';

import {reducers} from './store/app.reducers';
import {OpenLoginDialogDirective} from './session/open-login-dialog.directive';

import {environment} from '../environments/environment';

import {SessionModule} from './session/session.module';

// Interactive map
import {AppInteractiveMapModule} from './app-interactive-map/app-interactive-map.module';
import {InteractiveMapEffects} from './app-interactive-map/store/interactive-map.effects';
// end interactive map

// Design tool
import { DesignToolComponent } from './app-design-tool/design-tool.component';
import {AppFormDesignComponent} from './app-design-tool/components/app-form-design/app-form-design.component';
import {DesignToolEffects} from './app-design-tool/store/design-tool.effects';
// End design tool

// Jobs
import { JobsModule } from './jobs/jobs.module';
import {NinjaService} from './services/ninja-service';
// End jobs

// Models
import {ModelsEffects} from './app-models/store/models.effects';
import {AppModelsModule} from './app-models/app-models.module';
import {SharedEffects} from './store/shared.effects';
// End models

import { ProjectsModule } from './projects/projects.module';
import {SessionService} from './session/session.service';
import {AppMapsModule} from './app-maps/app-maps.module';
import {IamService} from './services/iam.service';
import {MapsService} from './services/maps.service';
import {MapsEffects} from './app-maps/store/maps.effects';


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
    OpenLoginDialogDirective,
    AppNotFoundComponent,
    DesignToolComponent,
    AppFormDesignComponent,
  ],
  imports: [
    // Angular modules
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,

    // third party
    AppMaterialModule,

    // Own modules
    SessionModule,
    AppInteractiveMapModule,
    AppModelsModule,
    JobsModule,
    ProjectsModule,
    AppMapsModule,

    // NgRX imports
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      InteractiveMapEffects,
      DesignToolEffects,
      ModelsEffects,
      SharedEffects,
      MapsEffects,
    ]),
    StoreDevtoolsModule.instrument({
      name: 'Caffeine',
    }),
  ],
  providers: [
    SessionService,
    NinjaService,
    IamService,
    MapsService,

    FormBuilder,
    ...(environment.sentry ? [{provide: ErrorHandler, useClass: RavenErrorHandler}] : []),
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppLoginDialogComponent],
})
export class AppModule {
}
