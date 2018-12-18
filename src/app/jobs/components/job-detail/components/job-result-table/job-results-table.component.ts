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

import {Component, Input, ViewChild, AfterViewInit, EventEmitter, OnInit} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';

import {PathwayPredictionReactions, PathwayPredictionResult} from '../../../../types';
import { JobResultsDetailRowDirective } from './job-results-table-row-detail.directive';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getModelName, getOrganismName} from '../../../../../store/shared.selectors';
import {AppState} from '../../../../../store/app.reducers';

const indicators = {
  delta: 'Δ',
  up: '↑',
  down: '↓',
};

@Component({
  selector: 'app-job-results-table',
  templateUrl: './job-results-table.component.html',
  styleUrls: ['./job-results-table.component.scss'],
})
export class JobResultTableComponent implements AfterViewInit, OnInit {
  @Input() tableData: PathwayPredictionResult[];
  @Input() reactions: PathwayPredictionReactions[];
  @Input() model: number;
  @Input() organism: number;
  @ViewChild(MatSort) sort: MatSort;
  model_name: Observable<string>;
  organism_name: Observable<string>;

  options = {
    yield: {
      floor: 0,
      ceil: 1,
      minRange: 0.1,
      step: .1,
    },
    fitness: {
      floor: 0,
      ceil: 1,
      minRange: 0.1,
      step: .1,
    },
    biomass: {
      floor: 0,
      ceil: 1,
      minRange: 0.1,
      step: .1,
    },
    product: {
      floor: 0,
      ceil: 10,
      minRange: 0.1,
      step: .5,
    },
    reactions: {
      floor: 0,
      ceil: 50,
      minRange: 1,
      step: 1,
    },
    manipulations: {
      floor: 0,
      ceil: 200,
      minRange: 1,
      step: 1,
    },
  };
  public dataSource = new MatTableDataSource<PathwayPredictionResult>([]);
  private collapseClicked = new EventEmitter<PathwayPredictionResult>();
  public expandedId: string = null;
  public yieldFilter = new FormControl([0, 1]);
  public fitnessFilter = new FormControl([0, 1]);
  public biomassFilter = new FormControl([0, 1]);
  public productFilter = new FormControl([0, 10]);
  public reactionsFilter = new FormControl([0, 50]);
  public manipulationsFilter = new FormControl([0, 200]);
  public methodFilter = new FormControl('');

  public filterValues = {
    organism: '',
    yieldNum: [0, 1],
    product: [0, 10],
    fitness: [0, 1],
    biomass: [0, 1],
    reactions: [0, 50],
    manipulations: [0, 200],
    method: '',
  };

  displayedColumns: string[] = [
    'select',
    'model',
    'manipulations',
    'heterologous_reactions',
    'fitness',
    'yield',
    'product',
    'biomass',
    'method',
  ];

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.model_name = this.store.pipe(
      select(getModelName(this.model)));

    this.organism_name = this.store.pipe(
      select(getOrganismName(this.organism)));

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

  geneLink(manipulation: {id: string}): string {
    return `http://bigg.ucsd.edu/search?query=${manipulation.id}`;
  }

  hpLink(hp: string): string {
    return `https://www.metanetx.org/equa_info/${hp.replace('DM_', '')}`;
  }

  dispManipulation(
    {direction, id}: {direction: string, id: string},
    ): string {
      return `${indicators[direction]} ${id}`;
  }

  dispManipulations(
    manipulations: {direction: string, id: string}[],
    ): string {
      const [firstManipulation] = manipulations;
      if (firstManipulation) {
        return `${this.dispManipulation(firstManipulation)}...`;
      } else {
        return '-';
      }
  }


  toggleChange(val: JobResultsDetailRowDirective): void {
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

  countPathways (hps: string[]): number {
    return hps.filter((hp) => !hp.startsWith('DM')).length;
  }

  // tslint:disable-next-line:no-any
  createFilter(): (data: any, filter: string) => boolean {
    /* tslint:disable */
    const filterFunction = function(data, filter): boolean {
      const searchTerms = JSON.parse(filter);
      return data.yield >= searchTerms.yieldNum[0] && data.yield <= searchTerms.yieldNum[1]
        && data.product >= searchTerms.product[0] && data.product <= searchTerms.product[1]
        && data.fitness >= searchTerms.fitness[0] && data.fitness <= searchTerms.fitness[1]
        && data.biomass >= searchTerms.biomass[0] && data.biomass <= searchTerms.biomass[1]
        && data.heterologous_reactions.length >= searchTerms.reactions[0] && data.heterologous_reactions.length <= searchTerms.reactions[1]
        && data.manipulations.length >= searchTerms.manipulations[0] && data.manipulations.length <= searchTerms.manipulations[1]
        && data.method.toLowerCase().includes(searchTerms.method.toLowerCase());
    };
    /* tslint:enable */
    return filterFunction;
  }
}
