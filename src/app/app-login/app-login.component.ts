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
import {ActivatedRoute, Params, Router} from '@angular/router';
import { SessionService } from '../session/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class LoginComponent implements OnInit {
  public nextUrl: string;
  public github: () => void;
  public google: () => void;
  public twitter: () => void;

  constructor(
    sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
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

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.nextUrl = params.next;
    });
  }
}
