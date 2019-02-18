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

import { HttpResponse } from '@angular/common/http';

export interface CacheEntry {
  url: string;
  // tslint:disable-next-line:no-any
  response: HttpResponse<any>;
  entryTime: number;
}

export const MAX_CACHE_AGE = 1.8e+6; // 30 minutes on miliseconds
