import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
// import {SessionService} from '../session/session.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.css']
})
export class AppToolbarComponent {
  isAuthenticated: boolean;
  @Input() sidenav: MatSidenav;

  constructor(
    // session: SessionService
  ) {
    // this.isAuthenticated = session.isAuthenticated();
  }
}
