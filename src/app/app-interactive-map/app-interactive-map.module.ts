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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';


import { AppInteractiveMapComponent } from './app-interactive-map.component';
import { ReactionModule } from './components/app-reaction/app-reaction.module';
import { AppBuildComponent } from './components/app-build/app-build.component';
import { AppCardInfoComponent } from './components/app-card-info/app-card-info.component';
import { AppLegendComponent } from './components/app-legend/app-legend.component';
import { SimulationService } from './services/simulation.service';
import { MapService } from './services/map.service';
import {LoaderComponent} from './components/loader/loader.component';
import {AppMaterialModule} from '../app-material.module';
import {ModelService} from '../services/model.service';
import {WarehouseService} from '../services/warehouse.service';
import {AppRoutingModule} from '../app-routing.module';
import {ModalErrorComponent} from './components/modal-error/modal-error.component';
import {SelectProjectComponent} from './components/app-build/components/select-project/select-project.component';
import {ShowHelpComponent} from './components/app-build/components/show-help/show-help.component';
import {WarningSaveComponent} from './components/app-build/components/warning-save/warning-save.component';
import { ErrorMsgComponent } from './components/app-reaction/components/error-msg/error-msg.component';


@NgModule({
  declarations: [
    AppInteractiveMapComponent,
    AppBuildComponent,
    AppCardInfoComponent,
    AppLegendComponent,
    LoaderComponent,
    ModalErrorComponent,
    ShowHelpComponent,
    WarningSaveComponent,
    ErrorMsgComponentt,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    AppMaterialModule,

    ReactionModule,
  ],
  providers: [
    SimulationService,
    MapService,
    ModelService,
    WarehouseService,
  ],
  exports: [
    AppInteractiveMapComponent,
  ],
  entryComponents: [LoaderComponent, ModalErrorComponent, SelectProjectComponent, ShowHelpComponent,
    WarningSaveComponen, ErrorMsgComponentt],
})
export class AppInteractiveMapModule {}
