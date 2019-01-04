import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import * as actions from '../store/shared.actions';
import {DesignRequest} from './types';
import {DeleteDesignComponent} from './components/delete-design/delete-design.component';
import {AddCard, SetModel} from '../app-interactive-map/store/interactive-map.actions';
import {CardType, DeCaF} from '../app-interactive-map/types';
import {Router} from '@angular/router';
import {FetchModel} from '../app-models/store/models.actions';
import {NgModelGroup} from '@angular/forms';
import ModelHeader = DeCaF.ModelHeader;

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
  private modelOfDesign: ModelHeader;

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
  }

  deleteDesign(design: DesignRequest): void {
    this.dialog.open(DeleteDesignComponent, {
      data: design,
    });
  }

  addDesign(design: DesignRequest): void {
    console.log('ADD DESINGS BEFORE', this.designs);
    if (this.designs.includes(design)) {
      this.designs = this.designs.filter((d) => d.id !== design.id);
    } else {
      this.designs.push(design);
    }
    console.log('ADD DESINGS AFTER', this.designs);
  }

  addCards(): void {
    this.store.pipe(select((store) => store.interactiveMap.cards)).subscribe((cards) => {
      console.log('CARDS', cards);
      if (this.cardAdded) {
        console.log('DESIGNS BEFORE IF', this.designs);
        if (this.designs.length > 0) {
          console.log('DESIGNS', this.designs);
          this.lastDesign = this.designs.pop();
          console.log('LAST DESIGN', this.lastDesign);
          this.store.dispatch(new AddCard(CardType.Design, this.lastDesign));
        } else {
          const lastCard = cards.cardsById[Object.keys(cards.cardsById)[Object.keys(cards.cardsById).length - 1]];
          console.log('LAST CARD', lastCard);
          if (lastCard) {
            console.log('LAST CARD', lastCard, this.lastDesign);
            if (this.lastDesign.design.added_reactions.length > 0) {
              const lastAddedReaction = lastCard.model.reactions.find((reaction) => reaction.id ===
                this.lastDesign.design.added_reactions[this.lastDesign.design.added_reactions.length - 1].bigg_id);
              if (lastAddedReaction) {
                this.cardAdded = false;
                setTimeout(() => this.router.navigateByUrl('/interactiveMap'), 5000);
              }
            } else {
              console.log('ELSE ADDED REACTIONS');
              setTimeout(() => this.router.navigateByUrl('/interactiveMap'), 5000);
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

  ngOnDestroy(): void {}
}
