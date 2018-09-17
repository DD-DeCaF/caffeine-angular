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
