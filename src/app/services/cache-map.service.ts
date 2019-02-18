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
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Cache } from '../cache';
import { CacheEntry, MAX_CACHE_AGE } from '../cache-entry';

@Injectable()
export class CacheMapService implements Cache {
  cacheMap = new Map<string, CacheEntry>();
  // tslint:disable-next-line:no-any
  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) {
      return null;
    }
    const isExpired = (Date.now() - entry.entryTime) > MAX_CACHE_AGE;
    return isExpired ? null : entry.response;
  }
  // tslint:disable-next-line:no-any
  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const entry: CacheEntry = { url: req.urlWithParams, response: res, entryTime: Date.now() };
    this.cacheMap.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }
  private deleteExpiredCache(): void {
    this.cacheMap.forEach((entry) => {
      if ((Date.now() - entry.entryTime) > MAX_CACHE_AGE) {
        this.cacheMap.delete(entry.url);
      }
    });
  }
}
