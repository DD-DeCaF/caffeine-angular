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

import {Component, AfterViewInit, ElementRef} from '@angular/core';
import {select} from 'd3-selection';
import * as escher from '@dd-decaf/escher';

import map from './test-map.json';
import escherSettings from './escherSettings';

@Component({
  selector: 'app-interactive-map',
  templateUrl: './app-interactive-map.component.html',
  styleUrls: ['./app-interactive-mapcomponent.scss'],
})
export class AppInteractiveMapComponent implements AfterViewInit {
  constructor(
    private elRef: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    const element = select(this.elRef.nativeElement.querySelector('.escher-builder'));
    escher.Builder(
      <[escher.MetaData, escher.MapData]> JSON.parse(map),
      null,
      null,
      element,
      escherSettings,
    );
  }
}
