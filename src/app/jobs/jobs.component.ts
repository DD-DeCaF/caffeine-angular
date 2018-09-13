import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { FetchJobs } from './store/jobs.actions';

@Component({
  selector: 'app-jobs',
  template: `<router-outlet></router-outlet>`,
})
export class JobsComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchJobs());
  }
}
