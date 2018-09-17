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

import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'float',
})
export class FloatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(
    value: number,
    lowerBound: number= 1e-3,
    upperBound: number= 1e3,
    NaNValue: string= '-',
    ): string {
      if (typeof value !== 'number' || !isFinite(value)) {
        return NaNValue;
      }

      if (value === 0) {
        return '0';
      }

      if (lowerBound < value && value < upperBound) {
        return this.decimalPipe.transform(value, '1.2-2');
      } else {
        return value.toExponential(2);
      }
  }
}
