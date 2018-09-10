import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material';
import {fromEvent} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/app.reducers';
import {AbortJobDesign} from '../../../../store/design-tool.actions';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit, AfterViewInit {
  @ViewChild('abort') abortButton: MatButton;
  @ViewChild('view') viewButton: MatButton;
  @Input() job;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.abortButton._elementRef.nativeElement, 'click').subscribe(() => this.store.dispatch(new AbortJobDesign(this.job)));
  }

}
