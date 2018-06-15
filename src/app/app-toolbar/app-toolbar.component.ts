import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {SessionState} from '../session/store/session.reducers';
import {Observable} from 'rxjs';
// import {SessionService} from '../session/session.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss']
})
export class AppToolbarComponent implements OnInit {
  sessionState: Observable<SessionState>;
  @Input() sidenav: MatSidenav;

  constructor(
    // session: SessionService
    private store: Store<AppState>,
  ) {
    // this.isAuthenticated = session.isAuthenticated();
  }

  ngOnInit() {
    this.sessionState = this.store.select('session');
  }
}
