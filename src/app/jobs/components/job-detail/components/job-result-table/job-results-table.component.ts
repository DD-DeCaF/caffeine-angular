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
  Input,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Manipulation, PathwayPredictionReactions, PathwayPredictionResult, PathwayPredictionMetabolites} from '../../../../types';
import {JobResultsDetailRowDirective} from './job-results-table-row-detail.directive';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getModelName, getOrganismName} from '../../../../../store/shared.selectors';
import {AppState} from '../../../../../store/app.reducers';
import {SelectionModel} from '@angular/cdk/collections';
import {selectNotNull} from '../../../../../framework-extensions';
import {getSelectedCard} from '../../../../../app-interactive-map/store/interactive-map.selectors';
import {AddCard} from '../../../../../app-interactive-map/store/interactive-map.actions';
import {CardType, DeCaF} from '../../../../../app-interactive-map/types';
import {Router} from '@angular/router';
import {isLoading} from '../../../../../app-interactive-map/components/loader/store/loader.selectors';
import {LoaderComponent} from '../../../../../app-interactive-map/components/loader/loader.component';
import {ModalErrorComponent} from '../../../../../app-interactive-map/components/modal-error/modal-error.component';

const indicators = {
  delta: 'Δ',
  up: '↑',
  down: '↓',
};

@Component({
  selector: 'app-job-results-table',
  templateUrl: './job-results-table.component.html',
  styleUrls: ['./job-results-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobResultTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() tableData: PathwayPredictionResult[];
  @Input() reactions: PathwayPredictionReactions;
  @Input() metabolites: PathwayPredictionMetabolites;
  @Input() model: DeCaF.Model;
  @Input() modelId: number;
  @Input() jobId: number;
  @Input() productName: string;
  @Input() organismId: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  model_name: Observable<string>;
  organism_name: Observable<string>;

  public options = null;

  public dataSource = new MatTableDataSource<PathwayPredictionResult>([]);
  public selection = new SelectionModel<PathwayPredictionResult>(true, []);

  private collapseClicked = new EventEmitter<PathwayPredictionResult>();
  public expandedId: string = null;
  public yieldFilter = new FormControl();
  public fitnessFilter = new FormControl();
  public biomassFilter = new FormControl();
  public productFilter = new FormControl();
  public reactionsFilter = new FormControl();
  public knockoutsFilter = new FormControl();
  public manipulationsFilter = new FormControl();
  public methodFilter = new FormControl('');
  private lastPrediction: PathwayPredictionResult;
  private cardAdded = false;
  private loadingObservable;
  private errorObservable;
  public showAllManipulations = false;
  public showAllKnockouts = false;

  public filterValues = {
    organism: '',
    yieldNum: null,
    product: null,
    fitness: null,
    biomass: null,
    reactions: null,
    knockouts: null,
    manipulations: null,
    method: '',
  };

  displayedColumns: string[] = [
    'select',
    'manipulations',
    'heterologous_reactions',
    'knockouts',
    'fitness',
    'yield',
    'product',
    'biomass',
    'method',
  ];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    if (this.tableData.length > 0) {
      this.getValues();
    }
    this.model_name = this.store.pipe(
      select(getModelName(this.modelId)));

    this.organism_name = this.store.pipe(
      select(getOrganismName(this.organismId)));

    this.yieldFilter.valueChanges
      .subscribe(
        (yieldNum) => {
          this.filterValues.yieldNum = yieldNum;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.fitnessFilter.valueChanges
      .subscribe(
        (fitness) => {
          this.filterValues.fitness = fitness;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.productFilter.valueChanges
      .subscribe(
        (product) => {
          this.filterValues.product = product;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.biomassFilter.valueChanges
      .subscribe(
        (biomass) => {
          this.filterValues.biomass = biomass;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.reactionsFilter.valueChanges
      .subscribe(
        (reactions) => {
          this.filterValues.reactions = reactions;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.knockoutsFilter.valueChanges
      .subscribe(
        (knockouts) => {
          this.filterValues.knockouts = knockouts;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.manipulationsFilter.valueChanges
      .subscribe(
        (manipulations) => {
          this.filterValues.manipulations = manipulations;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    this.methodFilter.valueChanges
      .subscribe(
        (method) => {
          this.filterValues.method = method;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    setTimeout(
      () =>
        this.dataSource.data = this.tableData
          .filter((dataRow) => dataRow.biomass > 0),
      0);

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'heterologous_pathway':
        case 'manipulations':
        case 'knockouts':
          return item[property].length;
        default:
          return item[property];
      }
    };

    // Later on use with datasource observable
    this.collapseClicked.subscribe((value) => {
      this.expandedId = value ? value.id : null;
    });
  }

  geneLink(manipulation: { id: string }): string {
    return `http://bigg.ucsd.edu/search?query=${manipulation.id}`;
  }

  knockoutLink(knockout: string): string {
    return `http://bigg.ucsd.edu/search?query=${knockout}`;
  }

  hpLink(hp: string): string {
    return `https://www.metanetx.org/equa_info/${hp.replace('DM_', '')}`;
  }

  showWarning(method: string, isChecked: boolean): void {
    if (method === 'PathwayPredictor+DifferentialFVA' && !isChecked) {
      this.snackBar.open(`Visualizing DifferentialFVA designs is not completely supported yet.
      Proceed with caution if you want to inspect the predicted pathways
      and knockouts on the interactive map.`, '', {
        duration: 12000,
      });
    }
  }

  dispManipulation(
    {direction, id, value}: Manipulation,
  ): string {
    return `${indicators[direction]} ${id}`;
  }

  dispManipulations(
    manipulations: Manipulation[],
  ): string {
    const [firstManipulation] = manipulations;
    if (firstManipulation) {
      return `${this.dispManipulation(firstManipulation)}...`;
    } else {
      return '-';
    }
  }


  toggleChange(val: JobResultsDetailRowDirective): void {
    this.showAllManipulations = false;
    this.showAllKnockouts = false;
    // @ts-ignore
    this.collapseClicked.emit(val);
  }

  dispHP(hp: string[]): string {
    const [firstHP] = hp;
    if (firstHP) {
      return `${firstHP}...`;
    } else {
      return '-';
    }
  }

  ecLink(ec: string): string {
    return `https://www.uniprot.org/uniprot/?query=ec:${ec}`;
  }

  countPathways(hps: string[]): number {
    return hps.filter((hp) => !hp.startsWith('DM')).length;
  }

  // tslint:disable-next-line:no-any
  createFilter(): (data: any, filter: string) => boolean {
    /* tslint:disable */
    const filterFunction = function (data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return data.yield >= searchTerms.yieldNum[0] && data.yield <= searchTerms.yieldNum[1]
        && data.product >= searchTerms.product[0] && data.product <= searchTerms.product[1]
        && data.fitness >= searchTerms.fitness[0] && data.fitness <= searchTerms.fitness[1]
        && data.biomass >= searchTerms.biomass[0] && data.biomass <= searchTerms.biomass[1]
        && data.heterologous_reactions.length >= searchTerms.reactions[0] && data.heterologous_reactions.length <= searchTerms.reactions[1]
        && data.knockouts.length >= searchTerms.knockouts[0] && data.knockouts.length <= searchTerms.knockouts[1]
        && data.manipulations.length >= searchTerms.manipulations[0] && data.manipulations.length <= searchTerms.manipulations[1]
        && data.method.toLowerCase().includes(searchTerms.method.toLowerCase());
    };
    /* tslint:enable */
    return filterFunction;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach((row) => {
        this.selection.select(row);
        this.showWarning(row.method, false);
      });
  }

  addValues(prediction: PathwayPredictionResult, counter: number): PathwayPredictionResult {
    prediction.name = 'Job ' + this.jobId + ' prediction ' + counter;
    prediction.model_id = this.modelId;
    prediction.model = this.model;
    return prediction;
  }

  addCards(): void {
    this.subscribeObservableLoading();
    const selectedCard = this.store.pipe(
      selectNotNull(getSelectedCard),
    );
    selectedCard.subscribe((card) => {
      if (card && this.lastPrediction) {
        if (card.name === this.lastPrediction.name) {
          if (this.selection.selected.length > 0) {
            this.lastPrediction = this.selection.selected.pop();
            this.lastPrediction = this.addValues(this.lastPrediction, this.dataSource.data.indexOf(this.lastPrediction));
            this.store.dispatch(new AddCard(CardType.Design, null, this.lastPrediction, this.reactions, this.metabolites));
          } else {
            if (this.lastPrediction.heterologous_reactions.length > 0) {
              const lastAddedReaction = card.model.reactions.find((reaction) => reaction.id ===
                this.lastPrediction.heterologous_reactions[this.lastPrediction.heterologous_reactions.length - 1]);
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
        this.lastPrediction = this.selection.selected.pop();
        this.lastPrediction = this.addValues(this.lastPrediction, this.dataSource.data.indexOf(this.lastPrediction) + 1);
        this.store.dispatch(new AddCard(CardType.Design, null, this.lastPrediction, this.reactions, this.metabolites));
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

  getValues(): void {
    const table = this.tableData.filter((t) => t.biomass > 0);
    this.filterValues.biomass = [table.reduce((min, row) => row.biomass < min ? row.biomass : min, table[0].biomass),
      table.reduce((max, row) => row.biomass > max ? row.biomass : max, table[0].biomass)];
    this.biomassFilter.patchValue(this.filterValues.biomass);

    this.filterValues.yieldNum = [table.reduce((min, row) => row.yield < min ? row.yield : min, table[0].yield),
      table.reduce((max, row) => row.yield > max ? row.yield : max, table[0].yield)];
    this.yieldFilter.patchValue(this.filterValues.yieldNum);

    this.filterValues.product = [table.reduce((min, row) => row.product < min ? row.product : min, table[0].product),
      table.reduce((max, row) => row.product > max ? row.product : max, table[0].product)];
    this.productFilter.patchValue(this.filterValues.product);

    this.filterValues.fitness = [table.reduce((min, row) => row.fitness < min ? row.fitness : min, table[0].fitness),
      table.reduce((max, row) => row.fitness > max ? row.fitness : max, table[0].fitness)];
    this.fitnessFilter.patchValue(this.filterValues.fitness);

    this.filterValues.reactions = [table.reduce((min, row) => row.heterologous_reactions.length < min ? row.heterologous_reactions.length : min,
      table[0].heterologous_reactions.length), table.reduce((max, row) => row.heterologous_reactions.length > max ?
      row.heterologous_reactions.length : max, table[0].heterologous_reactions.length)];
    this.reactionsFilter.setValue(this.filterValues.reactions);

    this.filterValues.knockouts = [table.reduce((min, row) => row.knockouts.length < min ? row.knockouts.length : min,
      table[0].knockouts.length), table.reduce((max, row) => row.knockouts.length > max ?
      row.knockouts.length : max, table[0].knockouts.length)];
    this.knockoutsFilter.setValue(this.filterValues.knockouts);

    this.filterValues.manipulations = [table.reduce((min, row) => row.manipulations.length < min ? row.manipulations.length : min,
      table[0].manipulations.length), table.reduce((max, row) => row.manipulations.length > max ?
      row.manipulations.length : max, table[0].manipulations.length)];
    this.manipulationsFilter.patchValue(this.filterValues.manipulations);
    this.options = {
      yield: {
        floor: parseInt(this.filterValues.yieldNum[0].toFixed(2), 10),
        ceil: parseInt(this.filterValues.yieldNum[1].toFixed(2), 10) >= 1 ? parseInt(this.filterValues.yieldNum[1].toFixed(2), 10) : 1,
        minRange: 0.1,
        step: .1,
      },
      fitness: {
        floor: parseInt(this.filterValues.fitness[0].toFixed(2), 10),
        ceil: parseInt(this.filterValues.fitness[1].toFixed(2), 10) >= 1 ? parseInt(this.filterValues.fitness[1].toFixed(2), 10) : 1,
        step: .01,
      },
      biomass: {
        floor: parseInt(this.filterValues.biomass[0].toFixed(2), 10),
        ceil: parseInt(this.filterValues.biomass[1].toFixed(2), 10) >= 1 ? parseInt(this.filterValues.biomass[1].toFixed(2), 10) : 1,
        minRange: 0.05,
        step: .1,
      },
      product: {
        floor: parseInt(this.filterValues.product[0].toFixed(2), 10),
        ceil: parseInt(this.filterValues.product[1].toFixed(2), 10) >= 1 ? parseInt(this.filterValues.product[1].toFixed(2), 10) : 1,
        minRange: 0.1,
        step: .5,
      },
      reactions: {
        floor: parseInt(this.filterValues.reactions[0], 10),
        ceil: parseInt(this.filterValues.reactions[1], 10) >= 1 ? parseInt(this.filterValues.reactions[1].toFixed(2), 10) : 1,
        step: 1,
      },
      knockouts: {
        floor: parseInt(this.filterValues.knockouts[0], 10),
        ceil: parseInt(this.filterValues.knockouts[1], 10) >= 1 ? parseInt(this.filterValues.knockouts[1].toFixed(2), 10) : 1,
        step: 1,
      },
      manipulations: {
        floor: parseInt(this.filterValues.manipulations[0], 10),
        ceil: parseInt(this.filterValues.manipulations[1], 10) >= 1 ? parseInt(this.filterValues.manipulations[1].toFixed(2), 10) : 1,
        step: 1,
      },
    };
  }

  getManipulations(manipulations: Manipulation[]): Manipulation[] {
    return manipulations.sort((a, b) => (Math.abs(a.value) < Math.abs(b.value)) ? 1 : -1);
  }

  ngOnDestroy(): void {
    if (this.loadingObservable) {
      this.loadingObservable.unsubscribe();
    }
    if (this.errorObservable) {
      this.errorObservable.unsubscribe();
    }
  }
}
