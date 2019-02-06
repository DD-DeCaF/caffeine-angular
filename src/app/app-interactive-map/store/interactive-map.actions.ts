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

import * as types from '../types';
import {DesignRequest} from '../../app-designs/types';
import {PathwayPredictionResult, PathwayPredictionReactions, PathwayPredictionMetabolites} from '../../jobs/types';
import {DataResponse, DeCaF} from '../types';
import Operation = DeCaF.Operation;
import {HydratedCard} from '../types';

export const SET_SELECTED_SPECIES = 'SET_SELECTED_SPECIES';
export const SET_MODEL = 'SET_MODEL';
export const SET_FULL_MODEL = 'SET_FULL_MODEL';
export const SET_MODEL_DATA_DRIVEN = 'SET_MODEL_DATA_DRIVEN';
export const SET_FULL_MODEL_DATA_DRIVEN = 'SET_FULL_MODEL_DATA_DRIVEN';
export const SELECT_FIRST_MODEL_MAP = 'SELECT_FIRST_MODEL_MAP';

export const SET_MAP = 'SET_MAP';
export const MAP_FETCHED = 'MAP_FETCHED';

export const RESET_CARDS = 'RESET_CARDS';
export const NEXT_CARD = 'NEXT_CARD';
export const PREVIOUS_CARD = 'PREVIOUS_CARD';
export const SELECT_CARD = 'SELECT_CARD';

export const SET_PLAY_STATE = 'SET_PLAY_STATE';

export const LOADED = 'LOADED';

export const ADD_CARD = 'ADD_CARD';
export const ADD_CARD_FETCHED = 'ADD_CARD_FETCHED';
export const DELETE_CARD = 'DELETE_CARD';
export const RENAME_CARD = 'RENAME_CARD';

export const SET_METHOD_APPLY = 'SET_METHOD_APPLY';
export const SET_METHOD = 'SET_METHOD';
export const REACTION_OPERATION = 'REACTION_OPERATION';
export const REACTION_OPERATION_APPLY = 'REACTION_OPERATION_APPLY';
export const SET_OBJECTIVE_REACTION = 'SET_OBJECTIVE_REACTION';
export const SET_OBJECTIVE_REACTION_APPLY = 'SET_OBJECTIVE_REACTION_APPLY';
export const SAVE_DESIGN = 'SAVE_DESIGN';
export const SAVE_NEW_DESIGN = 'SAVE_NEW_DESIGN';
export const SET_OPERATIONS = 'SET_OPERATIONS';
export const CHANGE_SELECTED_SPECIES = 'CHANGE_SELECTED_SPECIES';
export const CHANGE_SELECTED_MODEL = 'CHANGE_SELECTED_MODEL';
export const SET_SELECTED_MODEL = 'SET_SELECTED_MODEL';
export const UPDATE_SOLUTION = 'UPDATE_SOLUTION';

export class SetSelectedSpecies implements Action {
  readonly type = SET_SELECTED_SPECIES;
  constructor(public payload: types.Species) {}
}

export class SetModel implements Action {
  readonly type = SET_MODEL;
  constructor(public payload: types.DeCaF.ModelHeader) {}
}

export class SetFullModel implements Action {
  readonly type = SET_FULL_MODEL;
  constructor(public payload: types.DeCaF.Model) {}
}

export class SetModelDataDriven implements Action {
  readonly type = SET_MODEL_DATA_DRIVEN;
  constructor(public payload: types.DeCaF.ModelHeader) {}
}

export class SetFullModelDataDriven implements Action {
  readonly type = SET_FULL_MODEL_DATA_DRIVEN;
  constructor(public payload: types.DeCaF.Model) {}
}

export class SetMap implements Action {
  readonly type = SET_MAP;
  constructor(public payload: types.MapItem) {}
}

export class MapFetched implements Action {
  readonly type = MAP_FETCHED;
  constructor(public payload: {mapData: PathwayMap, mapItem: types.MapItem}) {}
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
  constructor(
    public payload: types.CardType, 
    public design: DesignRequest = null, 
    public pathwayPrediction: PathwayPredictionResult = null, 
    public reactions: PathwayPredictionReactions = null,
    public metabolites: PathwayPredictionMetabolites = null,
  ) {}
}

export class AddCardFetched implements Action {
  readonly type = ADD_CARD_FETCHED;
  constructor(public payload: {
    type: types.CardType,
    solution: types.DeCaF.Solution,
    design?: DesignRequest,
    pathwayPrediction?: PathwayPredictionResult,
  }) {}
}

export class UpdateSolution implements Action {
  readonly type = UPDATE_SOLUTION;
  constructor(public payload: types.DeCaF.Solution) {}
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
  constructor(public payload: types.Methods) {}
}

export class SetMethodApply implements Action {
  readonly type = SET_METHOD_APPLY;
  constructor(public payload: types.Methods) {}
}

export class ReactionOperation implements Action {
  readonly type = REACTION_OPERATION;
  constructor(public payload: types.OperationPayload) {}
}
export class ReactionOperationApply implements Action {
  readonly type = REACTION_OPERATION_APPLY;
  constructor(public payload: types.OperationPayload) {}
}

export class SetObjectiveReaction implements Action {
  readonly type = SET_OBJECTIVE_REACTION;
  constructor(public payload: types.ObjectiveReactionPayload) {}
}

export class SetObjectiveReactionApply implements Action {
  readonly type = SET_OBJECTIVE_REACTION_APPLY;
  constructor(public payload: types.ObjectiveReactionPayload) {}
}

export class SelectFirstModel implements Action {
  readonly type = SELECT_FIRST_MODEL_MAP;
  constructor(public species: types.Species, public models: types.DeCaF.ModelHeader[]) {}
}

export class SaveDesign implements Action {
  readonly type = SAVE_DESIGN;
  constructor(public payload: types.HydratedCard, public projectId: number) {}
}

export class SaveNewDesign implements Action {
  readonly type = SAVE_NEW_DESIGN;
  constructor(public payload: {id: number}) {}
}

export class SetOperations implements Action {
  readonly type = SET_OPERATIONS;
  constructor(public operations: Operation[], public method: string, public experiment: number, public condition: number, public model_id: number,
              public conditions: DataResponse) {}
}

export const operationToApply = {
  [REACTION_OPERATION]: ReactionOperationApply,
  [SET_METHOD]: SetMethodApply,
  [SET_OBJECTIVE_REACTION]: SetObjectiveReactionApply,
};

export class ChangeSelectedSpecies implements Action {
  readonly type = CHANGE_SELECTED_SPECIES;
  constructor(public payload: types.Species) {}
}

export class ChangeSelectedModel implements Action {
  readonly type = CHANGE_SELECTED_MODEL;
  constructor(public payload: number, public card: HydratedCard) {}
}

export class SetSelectedModel implements Action {
  readonly type = SET_SELECTED_MODEL;
  constructor(public payload: types.DeCaF.Model, public solution: types.DeCaF.Solution) {}
}

export type OperationAction = SetObjectiveReaction | ReactionOperation;
export type InteractiveMapActions =
  SetSelectedSpecies |
  SetModel |
  SetFullModel |
  MapFetched |
  ResetCards |
  SelectCard |
  NextCard |
  PreviousCard |
  SetPlayState |
  AddCardFetched |
  DeleteCard |
  RenameCard |
  SetMethodApply |
  ReactionOperationApply |
  SetObjectiveReactionApply |
  SaveDesign |
  SaveNewDesign |
  SelectFirstModel |
  SetOperations |
  ChangeSelectedSpecies |
  ChangeSelectedModel |
  SetSelectedModel |
  SetFullModelDataDriven |
  SetModelDataDriven |
  UpdateSolution;
