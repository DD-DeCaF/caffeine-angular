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

import {CardType, Card} from '../types';

export const NEXT_CARD = 'NEXT_CARD';
export const PREVIOUS_CARD = 'PREVIOUS_CARD';
export const SELECT_CARD = 'SELECT_CARD';

export const TOGGLE_PLAY = 'TOGGLE_PLAY';

export const LOADED = 'LOADED';

export const ADD_CARD = 'ADD_CARD';
export const DELETE_CARD = 'DELETE_CARD';

export const OPERATION_REACTION = 'OPERATION_REACTION';
export const UNDO_OPERATION_REACTION = 'UNDO_OPERATION_REACTION';
export const KNOCKOUT_REACTION = 'KNOCKOUT_REACTION';
export const SETOBJECTIVE_REACTION = 'SETOBJECTIVE_REACTION';
export const SETBOUNDS_REACTION = 'SETBOUNDS_REACTION';


export interface OperationPayload {
  cardId: string;
  reactionId: string;
  operationTarget: string;
}

export interface BoundsReaction extends OperationPayload {
  lowerBound: number;
  upperBound: number;
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

export class OperationReaction implements Action {
  readonly type = OPERATION_REACTION;
  constructor(public payload: OperationPayload) {}
}

export class SetObjectiveReaction implements Action {
  readonly type = SETOBJECTIVE_REACTION;
  constructor(public payload: OperationPayload) {}
}

export class SetReactionBounds implements Action {
  readonly type = SETBOUNDS_REACTION;
  constructor(public payload: BoundsReaction) {}
}

export class UndoOperationReaction implements Action {
  readonly type = UNDO_OPERATION_REACTION;
  constructor(public payload: OperationPayload) {}
}

export type InteractiveMapActions = SelectCard | NextCard | PreviousCard | TogglePlay | AddCard | DeleteCard | OperationReaction |
  UndoOperationReaction | SetObjectiveReaction | SetReactionBounds;
