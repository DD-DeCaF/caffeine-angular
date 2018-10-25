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
import * as typesModel from 'src/app/app-models/types';


export const FETCH_MODEL_MODELS = 'FETCH_MODEL_MODELS';
export const SET_MODEL_MODELS = 'SET_MODEL_MODELS';
export const EDIT_MODEL_MODELS = 'EDIT_MODEL_MODELS';
export const SET_ERROR = 'SET_ERROR';
export const RESET_ERROR = 'RESET_ERROR';
export const REMOVE_MODEL_MODELS = 'REMOVE_MODEL_MODELS';
export const REMOVED_MODEL_MODELS = 'REMOVED_MODEL_MODELS';
export const RESET_REMOVED_MODEL_MODELS = 'RESET_REMOVED_MODEL_MODELS';
export const ADD_MODEL = 'ADD_MODEL';


export class FetchModel implements Action {
  readonly type = FETCH_MODEL_MODELS;
  constructor(public payload: types.DeCaF.ModelHeader) {}
}

export class SetModel implements Action {
  readonly type = SET_MODEL_MODELS;
  constructor(public payload: types.DeCaF.Model) {}
}

export class EditModel implements Action {
  readonly type = EDIT_MODEL_MODELS;
  constructor(public payload: typesModel.EditModel) {}
}

export class RemoveModel implements Action {
  readonly type = REMOVE_MODEL_MODELS;
  constructor(public payload: number) {}
}

export class RemovedModel implements Action {
  readonly type = REMOVED_MODEL_MODELS;
}

export class ResetRemovedModel implements Action {
  readonly type = RESET_REMOVED_MODEL_MODELS;
}

export class SetError implements Action {
  readonly type = SET_ERROR;
}

export class ResetError implements Action {
  readonly type = RESET_ERROR;
}

export class AddModel implements Action {
  readonly type = ADD_MODEL;
  constructor(public payload: typesModel.AddModel) {}
}



export type ModelsActions = FetchModel | SetModel | EditModel | SetError| RemoveModel | ResetError
  | RemovedModel | ResetRemovedModel | AddModel;
