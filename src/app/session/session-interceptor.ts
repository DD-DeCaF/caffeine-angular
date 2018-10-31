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

import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {SessionService} from './session.service';
import {AUTHORIZATION_TOKEN} from './consts';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  private refresh$;

  constructor(private injector: Injector) {
  }
  // tslint:disable-next-line:no-any
  public intercept(req: HttpRequest<Request>, next: HttpHandler): Observable<HttpEvent<any>> {
    const session = this.injector.get(SessionService);

    // Don't intercept the actual JWT refresh request.
    if (session.isRefreshURL(req.url)) {
      return next.handle(req);
    }

    if (session.hasToken() && session.isTrustedURL(req.url)) {
      // Add the authorization header from token in local storage.
      const authorizedRequest = () => {
        const jwt = localStorage.getItem(AUTHORIZATION_TOKEN);
        req = req.clone({headers: req.headers.set('Authorization', `Bearer ${jwt}`)});
        return next.handle(req);
      };

      if (this.refresh$ !== undefined) {
        // If a refresh request is currently in progress, wait for the token to refresh before proceeding with the
        // original request.
        return this.refresh$.pipe(switchMap(authorizedRequest));
      } else if (session.authorizationExpired()) {
        // If the JWT has expired, refresh it before continuing.
        this.refresh$ = session.refresh();
        this.refresh$.subscribe({
          complete: () => {
            // On completion, unset the refresh observable so subsequent requests stop attaching to it.
            this.refresh$ = undefined;
          },
        });
        // Now wait for the refreshed token to arrive before proceeding with the original request.
        return this.refresh$.pipe(switchMap(authorizedRequest));
      } else {
        // Session is still valid - simply handle the request with autorization header added.
        return authorizedRequest();
      }
    }

    // Authorization header is not relevant; handle request normally.
    return next.handle(req);
  }
}
