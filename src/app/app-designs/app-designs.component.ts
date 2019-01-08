import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {DesignRequest} from './types';
import {DeleteDesignComponent} from './components/delete-design/delete-design.component';
import {AddCard, SetMap} from '../app-interactive-map/store/interactive-map.actions';
import {CardType} from '../app-interactive-map/types';
import {Router} from '@angular/router';
import {selectNotNull} from '../framework-extensions';

@Component({
  selector: 'app-designs',
  templateUrl: './app-designs.component.html',
  styleUrls: ['./app-designs.component.scss'],
})
export class AppDesignsComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<DesignRequest>([]);
  public designs: DesignRequest[] = [];
  private cardAdded = false;
  private lastDesign: DesignRequest;
  private mapObservable;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'actions',
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

  deleteDesign(design: DesignRequest): void {
    this.dialog.open(DeleteDesignComponent, {
      data: design,
    });
  }

  addDesign(design: DesignRequest): void {
    if (this.designs.includes(design)) {
      this.designs = this.designs.filter((d) => d.id !== design.id);
    } else {
      this.designs.push(design);
    }
  }

  addCards(): void {
    this.store.pipe(select((store) => store.interactiveMap.cards)).subscribe((cards) => {
      if (this.cardAdded) {
        if (this.designs.length > 0) {
          this.lastDesign = this.designs.pop();
          this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
        } else {
          const lastCard = cards.cardsById[Object.keys(cards.cardsById)[Object.keys(cards.cardsById).length - 1]];
          if (lastCard) {
            if (this.lastDesign.design.added_reactions.length > 0) {
              const lastAddedReaction = lastCard.model.reactions.find((reaction) => reaction.id ===
                this.lastDesign.design.added_reactions[this.lastDesign.design.added_reactions.length - 1].bigg_id);
              if (lastAddedReaction) {
                this.cardAdded = false;
                setTimeout(() => this.router.navigateByUrl('/interactiveMap'), 0);
              }
            } else {
              setTimeout(() => this.router.navigateByUrl('/interactiveMap'), 0);
            }
          }
         }
      }
    });
    if (!this.cardAdded) {
      if (this.designs.length > 0) {
        this.lastDesign = this.designs.pop();
        this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
        this.cardAdded = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.mapObservable.unsubscribe();
  }
}
