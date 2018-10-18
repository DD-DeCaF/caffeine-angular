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
import * as types from '../../app-interactive-map/types';


export const FETCH_MODELS_MODELS = 'FETCH_MODELS_MODELS';
export const SET_MODELS_MODELS = 'SET_MODELS_MODELS';

export class FetchModelsModels implements Action {
  readonly type = FETCH_MODELS_MODELS;
}

export class SetModelsModels implements Action {
  readonly type = SET_MODELS_MODELS;
  constructor(public payload: types.DeCaF.ModelHeader[]) {}
}

export type ModelsActions = FetchModelsModels | SetModelsModels ;
