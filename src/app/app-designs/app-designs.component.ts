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

import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Observable, Subscription} from 'rxjs';

import {DesignRequest} from './types';
import {DeleteDesignComponent} from './components/delete-design/delete-design.component';
import {AddCard} from '../app-interactive-map/store/interactive-map.actions';
import {Card, CardType} from '../app-interactive-map/types';
import {Router} from '@angular/router';
import {selectNotNull} from '../framework-extensions';
import {SelectionModel} from '@angular/cdk/collections';
import {getSelectedCard} from '../app-interactive-map/store/interactive-map.selectors';
import {LoaderComponent} from '../app-interactive-map/components/loader/loader.component';
import {getModelName, getOrganismName} from '../store/shared.selectors';
import {DesignsDetailRowDirective} from './app-designs-row-detail.directive';
import {dialogConfig} from '../utils';
import {Loading, LoadingFinished} from '../app-interactive-map/components/loader/store/loader.actions';

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
  public designs: Subscription;
  public cardsSubscription: Subscription;

  private cards: { [key: string]: Card; };
  private design: Card;
  private collapseClicked = new EventEmitter();
  public expandedId: string = null;
  public showAllAddedReactions = false;
  public showAllKnockedOutReactions = false;
  public showAllGenes = false;
  public loadingObservable: Subscription;
  public dialogRef;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'select',
    'name',
    'organism_id',
    'model_id',
    'reaction_knockins',
    'reaction_knockouts',
    'gene_knockouts',
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.designs = this.store.pipe(select((store) => store.shared.designs)).subscribe((designs) => {
      this.dataSource.data = designs;
      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges();
      }
    });
    this.cardsSubscription = this.store.pipe(select((store) =>
      store.interactiveMap.cards.cardsById)).subscribe((cards) => {
      this.cards = cards;
      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges();
      }
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'reaction_knockins':
        case 'reaction_knockouts':
        case 'gene_knockouts':
          return item['design'][property].length;
        case 'organism_id':
          return item['model'][property];
        default:
          return item[property];
      }
    };

    this.collapseClicked.subscribe((value) => {
      this.expandedId = value ? value.id : null;
    });
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

  getModelName(modelId: number): Observable<string> {
    return this.store.pipe(select(getModelName(modelId)));
  }

  getOrganismName(organismId: number): Observable<string> {
    return this.store.pipe(select(getOrganismName(organismId)));
  }

  geneLink(geneId: string): string {
    return `http://bigg.ucsd.edu/search?query=${geneId}`;
  }

  reactionLink(reaction: string, method: string, isAddedReactions: boolean): string {
    const reactionId = (isAddedReactions && method === 'Pathway')
      ? JSON.parse(reaction).bigg_id
      : reaction;
    if (reactionId.startsWith('MNX')) {
      return `https://www.metanetx.org/equa_info/${reactionId}`;
    } return `http://bigg.ucsd.edu/search?query=${reactionId}`;
  }

  getReactionId(reaction: string, method: string): string {
    if (method === 'Pathway') {
      return JSON.parse(reaction).bigg_id;
    } return reaction;
  }

  deleteDesigns(): void {
    this.dialog.open(DeleteDesignComponent, {
      data: this.selection.selected,
    });
  }

  toggleChange(val: DesignsDetailRowDirective): void {
    this.showAllAddedReactions = false;
    this.showAllKnockedOutReactions = false;
    this.showAllGenes = false;
    this.collapseClicked.emit(val);
  }

  addCards(): void {
    this.store.dispatch(new Loading());
    const selectedCard = this.store.pipe(
      selectNotNull(getSelectedCard),
    );
    selectedCard.subscribe((card) => {
      if (card && this.lastDesign) {
        if (card.name === this.lastDesign.name) {
          if (this.selection.selected.length > 0) {
            do {
              this.lastDesign = this.selection.selected.pop();
              this.design = Object.values(this.cards).find((c) => c.designId === this.lastDesign.id);
            }
            while (this.design && this.selection.selected.length > 0);
            if (this.design) {
              this.store.dispatch(new LoadingFinished());
              this.router.navigateByUrl('/interactiveMap');
            } else {
              this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
              this.cardAdded = true;
            }
          } else {
            this.store.dispatch(new LoadingFinished());
            this.router.navigateByUrl('/interactiveMap');
          }
        }
      }
    });
    if (!this.cardAdded) {
      if (this.selection.selected.length > 0) {
        do {
          this.lastDesign = this.selection.selected.pop();
          this.design = Object.values(this.cards).find((c) => c.designId === this.lastDesign.id);
        }
        while (this.design && this.selection.selected.length > 0);
        if (this.design) {
          this.router.navigateByUrl('/interactiveMap');
        } else {
          this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
          this.cardAdded = true;
        }
      }
    }
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
    this.designs.unsubscribe();
    this.cardsSubscription.unsubscribe();
    this.loadingObservable.unsubscribe();
  }
}
