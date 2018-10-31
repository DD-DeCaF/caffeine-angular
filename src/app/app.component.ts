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

import {Component, HostBinding, OnInit} from '@angular/core';
import {Router, NavigationEnd, Event} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

import {Store} from '@ngrx/store';

import MAP_ICON from '../assets/images/map_icon.svg';
import HOURGLASS_FULL from '../assets/images/hourglass_full.svg';
import EDIT_ICON from '../assets/images/edit.svg';
import PLUS_ICON from '../assets/images/plus.svg';

import * as sessionActions from './session/store/session.actions';
import {SessionService} from './session/session.service';
import {environment} from '../environments/environment';
import {AppState} from './store/app.reducers';
import {Store} from '@ngrx/store';
import * as sharedActions from './store/shared.actions';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  public title = 'app';

  constructor(
    router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private store: Store<AppState>,
    private sessionService: SessionService,
  ) {
    if (environment.GA) {
      ga('create', environment.GA.trackingID, 'auto');
      router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
    }
    if (!environment.production) {
      this.setTheme('amber-theme');
    }
    matIconRegistry.addSvgIcon(
      'interactive-map',
      domSanitizer.bypassSecurityTrustResourceUrl(MAP_ICON),
    );
    matIconRegistry.addSvgIcon(
      'hourglass-full',
      domSanitizer.bypassSecurityTrustResourceUrl(HOURGLASS_FULL),
    );
    matIconRegistry.addSvgIcon(
      'design',
      domSanitizer.bypassSecurityTrustResourceUrl(EDIT_ICON),
    );
    matIconRegistry.addSvgIcon(
      'plus',
      domSanitizer.bypassSecurityTrustResourceUrl(PLUS_ICON),
    );
  }

  ngOnInit(): void {
    if (this.sessionService.hasToken()) {
      this.store.dispatch(new sessionActions.Login());
    }

    this.store.dispatch(new sharedActions.FetchSpecies());
    this.store.dispatch(new sharedActions.FetchMaps());
    this.store.dispatch(new sharedActions.FetchModels());
    this.store.dispatch(new sharedActions.FetchProjects());
    this.store.dispatch(new sharedActions.FetchJobs());
  }

  setTheme(theme: string): void {
    this.componentCssClass = theme;
  }
}
