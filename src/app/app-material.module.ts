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

import {NgModule} from '@angular/core';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatChipsModule,
} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

/**
 * https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
 */
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatSidenavModule, MatMenuModule, MatAutocompleteModule, MatDialogModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatTooltipModule, MatProgressBarModule, MatChipsModule, MatProgressSpinnerModule],
  exports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatSidenavModule, MatMenuModule, MatAutocompleteModule, MatDialogModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatTooltipModule, MatProgressBarModule, MatChipsModule, MatProgressSpinnerModule],
  providers: [MatIconRegistry],
})
export class AppMaterialModule {
}
