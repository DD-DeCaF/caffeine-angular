import { HttpResponse } from '@angular/common/http';

export interface CacheEntry {
  url: string;
  // tslint:disable-next-line:no-any
  response: HttpResponse<any>;
  entryTime: number;
}

export const MAX_CACHE_AGE = 1.8e+6; // 30 minutes on miliseconds
