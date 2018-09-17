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

import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

import { PathwayPredictionResult } from '../../../../types';
import { JobResultsDetailRowDirective } from './job-results-table-row-detail.directive';

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
export class JobResultTableComponent implements AfterViewInit {
  @Input() tableData: PathwayPredictionResult[];
  @Input() singleChildRowDetail: boolean;
  @ViewChild(MatSort) sort: MatSort;
  private openedRow: JobResultsDetailRowDirective;

  public dataSource = new MatTableDataSource<PathwayPredictionResult>([]);

  displayedColumns: string[] = [
    'id',
    'host',
    'model',
    'manipulations',
    'heterologous_pathway',
    'fitness',
    'yield',
    'product',
    'biomass',
    'method',
  ];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

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
  }

  onToggleChange(cdkDetailRow: JobResultsDetailRowDirective): void {
    if (this.singleChildRowDetail && this.openedRow && this.openedRow.expanded) {
      this.openedRow.toggle();
    }
    this.openedRow = cdkDetailRow.expanded ? cdkDetailRow : undefined;
  }

  geneLink(geneName: string): string {
    return `http://bigg.ucsd.edu/search?query=${geneName}`;
  }

  hpLink(hp: string): string {
    return `https://www.metanetx.org/equa_info/${hp.replace('DM_', '')}`;
  }

  dispManipulation(
    {direction, value}: {direction: string, value: string},
    ): string {
      return `${indicators[direction]} ${value}`;
  }

  dispManipulations(
    manipulations: {direction: string, value: string}[],
    ): string {
      const [firstManipulation] = manipulations;
      if (firstManipulation) {
        return `${this.dispManipulation(firstManipulation)}...`;
      } else {
        return '-';
      }
  }

  dispHP(hp: string[]): string {
    const [firstHP] = hp;
    if (firstHP) {
      return `${firstHP}...`;
    } else {
      return '-';
    }
  }
}
