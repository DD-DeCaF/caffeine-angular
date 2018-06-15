import {Component} from '@angular/core';
import { SessionService } from '../session/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class LoginComponent {
  public github: () => void;
  public google: () => void;
  public twitter: () => void;

  constructor(private sessionService: SessionService) {
    this.github = () => {
      sessionService.github();
    };
    this.google = () => {
      sessionService.google();
    };
    this.twitter = () => {
      sessionService.twitter();
    };
  }
}
