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
import { CanActivate, Router } from '@angular/router';
import { SessionState } from './session/store/session.reducers';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private sessionState$: Observable<SessionState>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.sessionState$ = this.store.select('session');
  }

  canActivate(): Observable<boolean> {
    return this.sessionState$.pipe(map((state) => {
      if (state.authenticated) {
        return true;
      }

      this.router.navigateByUrl('');
      return false;
    }));
  }
}
