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

import {CardType, OperationPayload, BoundsReaction, ObjectiveReactionPayload} from '../types';

export const NEXT_CARD = 'NEXT_CARD';
export const PREVIOUS_CARD = 'PREVIOUS_CARD';
export const SELECT_CARD = 'SELECT_CARD';

export const TOGGLE_PLAY = 'TOGGLE_PLAY';

export const LOADED = 'LOADED';

export const ADD_CARD = 'ADD_CARD';
export const DELETE_CARD = 'DELETE_CARD';

export const REACTION_OPERATION = 'REACTION_OPERATION';
export const REACTION_OPERATION_APPLY = 'REACTION_OPERATION_APPLY';
export const SET_OBJECTIVE_REACTION = 'SET_OBJECTIVE_REACTION';
export const SET_OBJECTIVE_REACTION_APPLY = 'SET_OBJECTIVE_REACTION_APPLY';
export const SET_BOUNDS_REACTION = 'SET_BOUNDS_REACTION';
export const SET_BOUNDS_REACTION_APPLY = 'SET_BOUNDS_REACTION_APPLY';


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

export class TogglePlay implements Action {
  readonly type = TOGGLE_PLAY;
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

export class ReactionOperation implements Action {
  readonly type = REACTION_OPERATION;
  constructor(public payload: OperationPayload) {}
}
export class ReactionOperationApply implements Action {
  readonly type = REACTION_OPERATION_APPLY;
  constructor(public payload: OperationPayload, public cardId: string) {}
}

export class SetObjectiveReaction implements Action {
  readonly type = SET_OBJECTIVE_REACTION;
  constructor(public payload: ObjectiveReactionPayload) {}
}

export class SetObjectiveReactionApply implements Action {
  readonly type = SET_OBJECTIVE_REACTION_APPLY;
  constructor(public payload: ObjectiveReactionPayload, public cardId: string) {}
}

export class SetReactionBounds implements Action {
  readonly type = SET_BOUNDS_REACTION;
  constructor(public payload: BoundsReaction) {}
}

export class SetReactionBoundsApply implements Action {
  readonly type = SET_BOUNDS_REACTION_APPLY;
  constructor(public payload: BoundsReaction, public cardId: string) {}
}

export type OperationActions = SetReactionBounds | SetObjectiveReaction | ReactionOperation;
export type InteractiveMapActions = SelectCard | NextCard | PreviousCard | TogglePlay | AddCard | DeleteCard |
  ReactionOperationApply | SetObjectiveReactionApply | SetReactionBoundsApply;
