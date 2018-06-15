import {Component} from '@angular/core';
import * as template from './app-welcome.content.html';

@Component({
  selector: 'app-app-welcome',
  template: `<div class="container">${template}</div>`,
  styleUrls: ['./app-welcome.component.scss']
})
export class AppWelcomeComponent {
}
