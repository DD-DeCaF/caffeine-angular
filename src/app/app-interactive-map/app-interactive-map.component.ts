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

import {Component, AfterViewInit, ElementRef, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {select} from 'd3';
import * as escher from '@dd-decaf/escher';

import escherSettingsConst from './escherSettings';
import {AppState} from '../store/app.reducers';
import {SetSelectedSpecies} from './store/interactive-map.actions';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-mapcomponent.scss'],
})
export class AppInteractiveMapComponent implements OnInit, AfterViewInit {
  private builder: escher.BuilderObject;

  public map: Observable<escher.PathwayMap>;

  constructor(
    private elRef: ElementRef,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new SetSelectedSpecies('ECOLX'));
    this.map = this.store.select((store) => store.interactiveMap.mapData);

    this.map
      .pipe(filter((mapData) => mapData !== null))
      .subscribe((mapData) => {
        this.builder.load_map(mapData);
      });
  }

  ngAfterViewInit(): void {
    const escherSettings = {
      ...escherSettingsConst,
      tooltip_callbacks: {
        knockout: (args) => { this.handleKnockout(args); },
        setAsObjective: (args) => { this.handleSetAsObjective(args); },
        changeBounds: (args) => { this.handleChangeBounds(args); },
        resetBounds: (args) => { this.handleResetBounds(args); },
        objectiveDirection: (args) => { this.handleObjectiveDirection(args); },
      },
    };

    const element = select(this.elRef.nativeElement.querySelector('.escher-builder'));
    this.builder = escher.Builder(
      null,
      null,
      null,
      element,
      escherSettings,
    );
  }

  handleKnockout(args: string): void {
    console.log('KNOCKOUT', args);
  }

  handleSetAsObjective(args: string): void {
    console.log('SET AS OBJECTIVE', args);
  }

  handleChangeBounds(args: string): void {
    console.log('CHANGE BOUNDS', args);
  }

  handleResetBounds(args: string): void {
    console.log('RESET BOUNDS', args);
  }

  handleObjectiveDirection(args: string): void {
    console.log('OBJECTIVE DIRECTION', args);
  }
}
