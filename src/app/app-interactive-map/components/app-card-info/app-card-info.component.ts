
import {Component, OnInit} from '@angular/core';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppState} from '../../../store/app.reducers';
import {getSelectedCard, HydratedCard} from '../../store/interactive-map.selectors';

@Component({
  selector: 'app-card-info',
  templateUrl: './app-card-info.component.html',
  styleUrls: ['./app-card-info.component.scss'],
})
export class AppCardInfoComponent implements OnInit {
  public card: Observable<HydratedCard>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.card = this.store.pipe(
      select(getSelectedCard));
  }
}
