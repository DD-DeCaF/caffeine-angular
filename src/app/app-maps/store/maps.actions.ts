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
import * as typesMap from 'src/app/app-maps/types';
import {MapItem} from '../../app-interactive-map/types';

export const EDIT_MAP = 'EDIT_MAP';
export const SET_ERROR_MAP = 'SET_ERROR_MAP';
export const RESET_ERROR_MAP = 'RESET_ERROR_MAP';
export const REMOVE_MAP = 'REMOVE_MAP';
export const REMOVED_MAP = 'REMOVED_MAP';
export const RESET_REMOVED_MAP = 'RESET_REMOVED_MAP';
export const ADD_MAP = 'ADD_MAP';
export const SET_MAP = 'SET_MAP';

export class SetMap implements Action {
  readonly type = SET_MAP;
  constructor(public payload: MapItem) {}
}

export class EditMap implements Action {
  readonly type = EDIT_MAP;
  constructor(public payload: typesMap.EditMap) {}
}

export class RemoveMap implements Action {
  readonly type = REMOVE_MAP;
  constructor(public payload: number) {}
}

export class RemovedMap implements Action {
  readonly type = REMOVED_MAP;
}

export class ResetRemovedMap implements Action {
  readonly type = RESET_REMOVED_MAP;
}

export class SetError implements Action {
  readonly type = SET_ERROR_MAP;
}

export class ResetError implements Action {
  readonly type = RESET_ERROR_MAP;
}

export class AddMap implements Action {
  readonly type = ADD_MAP;
  constructor(public payload: AddMap) {}
}


export type MapsActions = SetError | ResetError | EditMap | RemoveMap | RemovedMap | ResetRemovedMap | AddMap | SetMap;
