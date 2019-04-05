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

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddExperimentComponent } from './add-experiment/add-experiment.component';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
})
export class ExperimentsComponent {

  constructor(
    private dialog: MatDialog,
  ) { }

  addExperiment(): void {
    this.dialog.open(AddExperimentComponent, {
      height: '700px',
      width: '1000px',
      panelClass: 'dnd-dialog-container',
    });
  }

}
