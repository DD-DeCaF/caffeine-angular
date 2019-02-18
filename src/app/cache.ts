import { HttpRequest, HttpResponse } from '@angular/common/http';

export abstract class Cache {
  // tslint:disable-next-line:no-any
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
  // tslint:disable-next-line:no-any
  abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}
