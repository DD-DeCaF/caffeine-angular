import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'callback',
    pure: false,
})
export class CallbackPipe implements PipeTransform {
  // tslint:disable-next-line:no-any
  transform(items: any[], callback: (item: any) => boolean): any {
      if (!items || !callback) {
          return items;
      }
      return items.filter((item) => callback(item));
  }
}
