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

import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SessionService} from '../session/session.service';
import {ActivatedRoute, Params} from '@angular/router';
import {SessionState} from '../session/store/session.reducers';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './app-login-dialog.component.html',
  styleUrls: ['./app-login-dialog.component.scss'],
})
export class AppLoginDialogComponent implements OnInit {

  public loginForm: FormGroup;
  public nextUrl: string;
  public github: () => void;
  public google: () => void;
  public twitter: () => void;
  public uiStatus: string;
  public error: string;
  public sessionState: Observable<SessionState>;

  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AppLoginDialogComponent>,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private ngZoneService: NgZone) {
    this.uiStatus = 'ideal';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.github = () => {
      this.uiStatus = 'loading';
      sessionService.github()
        .then(() => {
          this.closeDialogs();
        });
    };
    this.google = () => {
      this.uiStatus = 'loading';
      sessionService.google()
        .then(() => {
          this.closeDialogs();
        });
    };
    this.twitter = () => {
      this.uiStatus = 'loading';
      sessionService.twitter()
        .then(() => {
          this.closeDialogs();
        });
    };
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.nextUrl = params.next;
    });
    this.sessionState = this.store.select('session');
  }

  public close(): void {
    this.dialogRef.close();
  }

  public async submit(): Promise<void> {
    this.uiStatus = 'loading';
    return this.sessionService
      .authenticate(this.loginForm.value)
      .then(() => {
        this.close();
      }).catch((error) => {
        this.uiStatus = 'error';
        this.error = error.error.message;
      });
  }

  public logout(): void {
    this.sessionService.logout();
  }

  public closeDialogs(): void {
    this.ngZoneService.runOutsideAngular(() => {
      this.ngZoneService.run(() => {
        this.dialog.closeAll();
      });
    });
  }
}
