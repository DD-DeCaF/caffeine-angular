// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from '../app-material.module';

import { JobsService } from './jobs.service';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobsComponent } from './jobs.component';
import { AppRoutingModule } from '../app-routing.module';
import { JobResultTableComponent } from './components/job-detail/components/job-result-table/job-results-table.component';
import { FloatPipe } from '../pipes/float.pipe';
import { JobResultsDetailRowDirective } from './components/job-detail/components/job-result-table/job-results-table-row-detail.directive';
import { Ng5SliderModule } from 'ng5-slider';
import {JobResultTableCofactorComponent} from './components/job-detail/components/job-result-table-cofactor/job-results-table-cofactor.component';

@NgModule({
  declarations: [
    FloatPipe,
    JobListComponent,
    JobDetailComponent,
    JobResultTableComponent,
    JobResultTableCofactorComponent,
    JobsComponent,
    JobResultsDetailRowDirective,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppRoutingModule,

    AppMaterialModule,
    Ng5SliderModule,
  ],
  providers: [
    JobsService,
    DecimalPipe,
  ],
  exports: [
    JobsComponent,
  ],
})
export class JobsModule {}
