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
import { AppMapsComponent } from './app-maps.component';
import { EditMapComponent } from './components/edit-map/edit-map.component';
import { RemoveMapComponent } from './components/remove-map/remove-map.component';
import {AddMapComponent} from './components/add-map/add-map.component';
import {RemovedMapComponent} from './components/remove-map/removed-map.component';
import {EditedMapComponent} from './components/edit-map/edited-map.component';
import {AddedMapComponent} from './components/add-map/added-map.component';


@NgModule({
  declarations: [
    AppMapsComponent,
    EditMapComponent,
    RemoveMapComponent,
    AddMapComponent,
    RemovedMapComponent,
    EditedMapComponent,
    AddedMapComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    AppMaterialModule,
  ],
  exports: [
    AppMapsComponent,
  ],
  entryComponents: [EditMapComponent, RemoveMapComponent, AddMapComponent, RemovedMapComponent, EditedMapComponent, AddedMapComponent],
})
export class AppMapsModule {}
