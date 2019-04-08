// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {LoaderComponent} from '../app-interactive-map/components/loader/loader.component';
import {AppState} from '../store/app.reducers';
import {MatDialog} from '@angular/material';
import {Subscription} from 'rxjs';
import {dialogConfig} from '../utils';

@Component({
  selector: 'app-jobs',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit, OnDestroy {
  public loadingObservable: Subscription;
  public dialogRef;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
  }
  ngOnInit(): void {
    this.loadingObservable = this.store.pipe(select((store) => store.loader.loading)).subscribe((loading: boolean) => {
      if (loading) {
        setTimeout(() => {
          this.dialogRef = this.dialog.open(LoaderComponent, dialogConfig);
        }, 0);
      } else {
        if (this.dialogRef) {
          setTimeout(() => {
            this.dialogRef.close();
          }, 0);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingObservable.unsubscribe();
  }
}
