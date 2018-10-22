import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../store/app.reducers';
import * as actions from './store/projects.actions';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  private projects$;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new actions.FetchProjects());

    this.projects$ = this.store.select((state) => state.projects.projects);
  }

}
