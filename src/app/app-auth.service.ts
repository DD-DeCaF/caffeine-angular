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

import {Injectable} from '@angular/core';
import {Location, PopStateEvent} from '@angular/common';

@Injectable()
export class AppAuthService {
  // isRequired = true;
  public trustedURLs: Set<string> = new Set();
  // location: any;
  public currentUrl: string = null;

  constructor(location: Location) {
    // TODO this should use the observable and expose an observable.
    location.subscribe((popStateEvent: PopStateEvent) => {
      this.currentUrl = popStateEvent.url;
    });
  }

  // getCurrentURL() {
  //   if (this.location._baseHref.startsWith('https://') || this.location._baseHref.startsWith('https://')) {
  //     return this.location.prepareExternalUrl(this.location.path());
  //   }
  //   // TODO - It does not seem like there is a clean way to do this.
  //   return this.location._platformStrategy._platformLocation.location.href;
  // }

  public isTrustedURL(url: string): boolean {
    const currentURL = this.currentUrl;
    const currentHostname = (new URL(currentURL)).hostname;

    const urlObj = new URL(url, currentURL);
    return urlObj.hostname === currentHostname || Array.from(this.trustedURLs)
      .some((trustedURL) => urlObj.href.startsWith(trustedURL));
  }
}
