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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {DesignRequest} from './types';
import {DeleteDesignComponent} from './components/delete-design/delete-design.component';
import {AddCard, SetMap} from '../app-interactive-map/store/interactive-map.actions';
import {CardType} from '../app-interactive-map/types';
import {Router} from '@angular/router';
import {selectNotNull} from '../framework-extensions';
import {SelectionModel} from '@angular/cdk/collections';
import {getSelectedCard} from '../app-interactive-map/store/interactive-map.selectors';
import {isLoading} from '../app-interactive-map/components/loader/store/loader.selectors';
import {LoaderComponent} from '../app-interactive-map/components/loader/loader.component';
import {ModalErrorComponent} from '../app-interactive-map/components/modal-error/modal-error.component';

@Component({
  selector: 'app-designs',
  templateUrl: './app-designs.component.html',
  styleUrls: ['./app-designs.component.scss'],
})
export class AppDesignsComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<DesignRequest>([]);
  public selection = new SelectionModel<DesignRequest>(true, []);

  private cardAdded = false;
  private lastDesign: DesignRequest;
  private mapObservable;
  private loadingObservable;
  private errorObservable;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'select',
    'name',
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.store.pipe(select((store) => store.shared.designs)).subscribe((designs) => {
      this.dataSource.data = designs;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.mapObservable = this.store.pipe(selectNotNull((store) => store.interactiveMap.selectedMap)).subscribe((map) => {
      this.store.dispatch(new SetMap(map));
    });
  }

  deleteDesigns(): void {
    this.dialog.open(DeleteDesignComponent, {
      data: this.selection.selected,
    });
  }

  addCards(): void {
    this.subscribeObservableLoading();
    const selectedCard = this.store.pipe(
      selectNotNull(getSelectedCard),
    );
    selectedCard.subscribe((card) => {
      if (card && this.lastDesign) {
        if (card.name === this.lastDesign.name) {
          if (this.selection.selected.length > 0) {
            this.lastDesign = this.selection.selected.pop();
            this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
          } else {
            if (this.lastDesign.design.added_reactions.length > 0) {
              const lastAddedReaction = card.model.reactions.find((reaction) => reaction.id ===
                this.lastDesign.design.added_reactions[this.lastDesign.design.added_reactions.length - 1].bigg_id);
              if (lastAddedReaction) {
                this.cardAdded = false;
                this.router.navigateByUrl('/interactiveMap');
              }
            } else {
              this.router.navigateByUrl('/interactiveMap');
            }
          }
        }
      }
    });
    if (!this.cardAdded) {
      if (this.selection.selected.length > 0) {
        this.lastDesign = this.selection.selected.pop();
        this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
        this.cardAdded = true;
      }
    }
  }

  public subscribeObservableLoading(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'loader';
    dialogConfig.id = 'loading';

    const dialogConfigError = new MatDialogConfig();
    dialogConfigError.disableClose = true;
    dialogConfigError.autoFocus = true;
    dialogConfigError.panelClass = 'loader';
    dialogConfigError.id = 'error';

    let error = false;

    this.loadingObservable = this.store.pipe(
      select(isLoading),
    ).subscribe((loading) => {
      if (loading) {
        // opening the dialog throws ExpressionChangedAfterItHasBeenCheckedError
        // See https://github.com/angular/material2/issues/5268#issuecomment-416686390
        // setTimeout(() => ...., 0);
        if (!this.dialog.openDialogs.find((dialog) => dialog.id === 'loading')) {
          setTimeout(() => this.dialog.open(LoaderComponent, dialogConfig), 0);
        }
      } else {
        this.errorObservable = this.store.pipe(select((store) => store.loader.loadingError)).subscribe((loadingError) => {
          if (loadingError && !error) {
            setTimeout(() => this.dialog.open(ModalErrorComponent, dialogConfigError), 0);
            error = true;
          } else {
            this.dialog.closeAll();
            error = false;

          }
        });
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  ngOnDestroy(): void {
    this.mapObservable.unsubscribe();
    if (this.loadingObservable) {
      this.loadingObservable.unsubscribe();
    }
    if (this.errorObservable) {
      this.errorObservable.unsubscribe();
    }
  }
}
