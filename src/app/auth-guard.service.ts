import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionState } from './session/store/session.reducers';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private sessionState$: Observable<SessionState>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) { 
    this.sessionState$ = this.store.select('session');
  }

  canActivate() {
    return this.sessionState$.pipe(map((state) => {
      if (state.authenticated) {
        return true
      }

      this.router.navigateByUrl('');
      return false
    }))
  }
}