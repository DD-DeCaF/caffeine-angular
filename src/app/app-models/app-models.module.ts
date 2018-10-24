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

import { AppMaterialModule } from '../app-material.module';
import { AppModelsComponent } from './app-models.component';
import { EditModelComponent } from './components/edit-model/edit-model.component';
import { ModelService } from '../services/model.service';
import { WarehouseService } from '../services/warehouse.service';
import { RemoveModelComponent } from './components/remove-model/remove-model.component';
import {AddModelComponent} from './components/add-model/add-model.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {RemovedModelComponent} from './components/remove-model/removed-model.component';
import {EditedModelComponent} from './components/edit-model/edited-model.component';
import {AddedModelComponent} from './components/add-model/added-model.component';


@NgModule({
  declarations: [
    AppModelsComponent,
    EditModelComponent,
    RemoveModelComponent,
    AddModelComponent,
    RemovedModelComponent,
    EditedModelComponent,
    AddedModelComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    AppMaterialModule,
    AngularFileUploaderModule,

  ],
  providers: [

    ModelService,
    WarehouseService,
  ],
  exports: [
    AppModelsComponent,
  ],
  entryComponents: [EditModelComponent, RemoveModelComponent, AddModelComponent, RemovedModelComponent, EditedModelComponent, AddedModelComponent],
})
export class AppModelsModule {}
