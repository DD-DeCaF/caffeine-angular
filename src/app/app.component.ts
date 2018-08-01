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

import {Component, HostBinding} from '@angular/core';
import {Router, NavigationEnd, Event} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

import MAP_ICON from '../assets/images/map_icon.svg';

import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class') componentCssClass;
  public title = 'app';

  constructor(
    router: Router,
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
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
  }
  setTheme(theme: string): void {
    this.componentCssClass = theme;
  }
}
