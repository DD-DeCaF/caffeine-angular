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

import {Action} from '@ngrx/store';


export const LOADING = 'LOADING';
export const LOADING_FINISHED = 'LOADING_FINISHED';
export const LOADING_ERROR = 'LOADING_ERROR';


export class Loading implements Action {
  readonly type = LOADING;
}

export class LoadingFinished implements Action {
  readonly type = LOADING_FINISHED;
}

export class LoadingError implements Action {
  readonly type = LOADING_ERROR;
}

export type LoaderActions = Loading | LoadingFinished | LoadingError;
