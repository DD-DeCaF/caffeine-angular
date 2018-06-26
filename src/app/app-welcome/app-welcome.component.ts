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

import {Component} from '@angular/core';

import * as template from './app-welcome.content.html';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-app-welcome',
  template: `<div class="container">${template}</div>`,
  styleUrls: ['./app-welcome.component.scss'],
})
export class AppWelcomeComponent {

  constructor(private dialog: MatDialog) {}

  public openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(LoginDialogComponent, dialogConfig);
  }
}
