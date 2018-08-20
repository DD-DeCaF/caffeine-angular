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

import { Component } from '@angular/core';

const defaultColor = 'white';
const warningColor = '#FEEFB3';

@Component({
  selector: 'app-legend',
  templateUrl: './app-legend.component.html',
  styleUrls: ['./app-legend.component.scss'],
})

export class AppLegendComponent {

  public background: string = defaultColor;
  public expanded = true;

  public toggle(): void {
    this.expanded = !this.expanded;
  }

  public getPredictedGrowth(): string {
    const rate = 0.6;
    const isRateMeaningful = Math.abs(rate) > 1e-05;
    this.background = isRateMeaningful ? defaultColor : warningColor;
    return isRateMeaningful ? rate.toPrecision(3) : '0';
  }

}
