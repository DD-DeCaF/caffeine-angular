import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';
import {PathwayPredictionResult} from '../jobs/types';
import {AppState} from '../store/app.reducers';
import {select, Store} from '@ngrx/store';
import * as fromActions from './store/models.actions';
import * as types from '../app-interactive-map/types';
import {Observable} from 'rxjs';
import {AUTHORIZATION_TOKEN} from '../session/consts';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-models',
  templateUrl: './app-models.component.html',
  styleUrls: ['./app-models.component.scss'],
})
export class AppModelsComponent implements OnInit {
  public dataSource = new MatTableDataSource<types.DeCaF.ModelHeader>([]);
  public models: Observable<types.DeCaF.ModelHeader[]>;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'edit',
    'remove',
  ];

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.FetchModelsModels());
    this.store.pipe(select((store) => store.models.models)).subscribe((models) => {
      this.dataSource.data = models;
    });
    this.dataSource.sort = this.sort;
  }

}
