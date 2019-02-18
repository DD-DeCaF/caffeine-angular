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

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheMapService } from './services/cache-map.service';
import {environment} from '../environments/environment';

const NOT_CACHABLE_URL = [`${environment.apis.model}/simulate`, `${environment.apis.metabolic_ninja}/predictions`];

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: CacheMapService) {}
  // tslint:disable-next-line:no-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRequestCachable(req)) {
      return next.handle(req);
    }
    const cachedResponse = this.cache.get(req);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.put(req, event);
        }
      }),
    );
  }
  // tslint:disable-next-line:no-any
  private isRequestCachable(req: HttpRequest<any>): boolean {
    const refresh = req.params.get('refresh') ? req.params.get('refresh') === 'false' : true;
    return (req.method === 'GET')
      && !NOT_CACHABLE_URL.some((urls) => req.url.startsWith(urls))
      && refresh;
  }
}
