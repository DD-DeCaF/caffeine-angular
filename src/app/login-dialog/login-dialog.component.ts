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

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {SessionService} from '../session/session.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {

  public loginForm: FormGroup;
  public nextUrl: string;
  public github: () => void;
  public google: () => void;
  public twitter: () => void;
  public uiStatus: string;
  public error: string;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.uiStatus = 'ideal';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.github = () => {
      sessionService.github()
        .then(() => {
          this.router.navigateByUrl(this.nextUrl ? this.nextUrl : '/');
        });
    };
    this.google = () => {
      sessionService.google()
        .then(() => {
          this.router.navigateByUrl(this.nextUrl ? this.nextUrl : '/');
        });
    };
    this.twitter = () => {
      sessionService.twitter()
        .then(() => {
          this.router.navigateByUrl(this.nextUrl ? this.nextUrl : '/');
        });
    };
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.nextUrl = params.next;
    });
  }

  public save(): void {
    this.dialogRef.close(this.loginForm.value);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.uiStatus = 'loading';
    this.sessionService.authenticate(this.loginForm.value) .then(() => {
      this.close();
    }).catch((error) => {
      this.uiStatus = 'error';
      this.error = error.error.message;
    });
  }
}
