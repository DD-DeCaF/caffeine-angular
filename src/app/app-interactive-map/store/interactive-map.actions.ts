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
import {PathwayMap} from '@dd-decaf/escher';

import {CardType, OperationPayload, ObjectiveReactionPayload, Cobra, MapItem, Methods, DeCaF, Species} from '../types';


export const FETCH_SPECIES = 'FETCH_SPECIES';
export const SET_SPECIES = 'SET_SPECIES';
export const SET_SELECTED_SPECIES = 'SET_SELECTED_SPECIES';
export const SET_MODELS = 'SET_MODELS';
export const SET_MODEL = 'SET_MODEL';
export const FETCH_MODEL = 'FETCH_MODEL';
export const MODEL_FETCHED = 'MODEL_FETCHED';

export const FETCH_MAPS = 'FETCH_MAPS';
export const SET_MAPS = 'SET_MAPS';
export const SET_MAP = 'SET_MAP';
export const MAP_FETCHED = 'MAP_FETCHED';

export const RESET_CARDS = 'RESET_CARDS';
export const NEXT_CARD = 'NEXT_CARD';
export const PREVIOUS_CARD = 'PREVIOUS_CARD';
export const SELECT_CARD = 'SELECT_CARD';

export const SET_PLAY_STATE = 'SET_PLAY_STATE';

export const LOADED = 'LOADED';

export const ADD_CARD = 'ADD_CARD';
export const DELETE_CARD = 'DELETE_CARD';
export const RENAME_CARD = 'RENAME_CARD';

export const SET_METHOD_APPLY = 'SET_METHOD_APPLY';
export const SET_METHOD = 'SET_METHOD';
export const REACTION_OPERATION = 'REACTION_OPERATION';
export const REACTION_OPERATION_APPLY = 'REACTION_OPERATION_APPLY';
export const SET_OBJECTIVE_REACTION = 'SET_OBJECTIVE_REACTION';
export const SET_OBJECTIVE_REACTION_APPLY = 'SET_OBJECTIVE_REACTION_APPLY';

export class FetchSpecies implements Action {
  readonly type = FETCH_SPECIES;
}

export class SetSpecies implements Action {
  readonly type = SET_SPECIES;
  constructor(public payload: Species[]) {}
}

export class SetSelectedSpecies implements Action {
  readonly type = SET_SELECTED_SPECIES;
  constructor(public payload: Species) {}
}

export class SetModels implements Action {
  readonly type = SET_MODELS;
  constructor(public payload: string[]) {}
}

export class SetModel implements Action {
  readonly type = SET_MODEL;
  constructor(public payload: string) {}
}

export class ModelFetched implements Action {
  readonly type = MODEL_FETCHED;
  constructor(
    public payload: {
      model: Cobra.Model,
      modelId: string,
      solution: DeCaF.Solution,
    }) {}
}

export class FetchMaps implements Action {
  readonly type = FETCH_MAPS;
}

export class SetMaps implements Action {
  readonly type = SET_MAPS;
  constructor(public payload: MapItem[]) {}
}

export class SetMap implements Action {
  readonly type = SET_MAP;
  constructor(public payload: MapItem) {}
}

export class MapFetched implements Action {
  readonly type = MAP_FETCHED;
  constructor(public payload: {mapData: PathwayMap, mapItem: MapItem}) {}
}

export class ResetCards implements Action {
  readonly type = RESET_CARDS;
}

export class SelectCard implements Action {
  readonly type = SELECT_CARD;
  constructor(public payload: string) {}
}

export class NextCard implements Action {
  readonly type = NEXT_CARD;
}

export class PreviousCard implements Action {
  readonly type = PREVIOUS_CARD;
}

export class SetPlayState implements Action {
  readonly type = SET_PLAY_STATE;
  constructor(public payload: boolean) {}
}

export class Loaded implements Action {
  readonly type = LOADED;
}

export class AddCard implements Action {
  readonly type = ADD_CARD;
  constructor(public payload: CardType) {}
}

export class DeleteCard implements Action {
  readonly type = DELETE_CARD;
  constructor(public payload: string) {}
}

export class RenameCard implements Action {
  readonly type = RENAME_CARD;
  constructor(public payload: string) {}
}

export class SetMethod implements Action {
  readonly type = SET_METHOD;
  constructor(public payload: Methods) {}
}

export class SetMethodApply implements Action {
  readonly type = SET_METHOD_APPLY;
  constructor(public payload: Methods) {}
}

export class ReactionOperation implements Action {
  readonly type = REACTION_OPERATION;
  constructor(public payload: OperationPayload) {}
}
export class ReactionOperationApply implements Action {
  readonly type = REACTION_OPERATION_APPLY;
  constructor(public payload: OperationPayload) {}
}

export class SetObjectiveReaction implements Action {
  readonly type = SET_OBJECTIVE_REACTION;
  constructor(public payload: ObjectiveReactionPayload) {}
}

export class SetObjectiveReactionApply implements Action {
  readonly type = SET_OBJECTIVE_REACTION_APPLY;
  constructor(public payload: ObjectiveReactionPayload) {}
}

export const operationToApply = {
  [REACTION_OPERATION]: ReactionOperationApply,
  [SET_METHOD]: SetMethodApply,
  [SET_OBJECTIVE_REACTION]: SetObjectiveReactionApply,
};

export type OperationAction = SetObjectiveReaction | ReactionOperation;
export type InteractiveMapActions = SetSpecies | SetSelectedSpecies | SetModels | ModelFetched | SetMaps | MapFetched |
  ResetCards | SelectCard | NextCard | PreviousCard | SetPlayState | AddCard | DeleteCard | RenameCard |
  SetMethodApply | ReactionOperationApply | SetObjectiveReactionApply;
