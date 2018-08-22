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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../../../app-material.module';

import { AppReactionComponent } from './app-reaction.component';
import { AppBoundsComponent } from './components/app-bounds/app-bounds.component';
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { AppObjectiveComponent } from './components/app-objective/app-objective.component';
import { AppPanelComponent } from './components/app-panel/app-panel.component';

@NgModule({
  declarations: [
    AppReactionComponent,
    AppBoundsComponent,
    AppDetailComponent,
    AppObjectiveComponent,
    AppPanelComponent,
  ],
  imports: [
    AppMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AppReactionComponent,
  ],
})
export class ReactionModule {}