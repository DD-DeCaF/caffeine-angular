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

import {CardType, Reaction} from '../types';

export const NEXT_CARD = 'NEXT_CARD';
export const PREVIOUS_CARD = 'PREVIOUS_CARD';
export const SELECT_CARD = 'SELECT_CARD';

export const TOGGLE_PLAY = 'TOGGLE_PLAY';

export const LOADED = 'LOADED';

export const ADD_CARD = 'ADD_CARD';
export const DELETE_CARD = 'DELETE_CARD';

export const ADD_REACTION = 'ADD_REACTION';
export const REMOVE_REACTION = 'REMOVE_REACTION';
export const SETOBJECTIVE_REACTION = 'SETOBJECTIVE_REACTION';
export const SETBOUNDS_REACTION = 'SETBOUNDS_REACTION';

export interface BoundsReaction {
  id: string;
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

export class AddReaction implements Action {
  readonly type = ADD_REACTION;
  constructor(public payload: string) {}
}

export class RemoveReaction implements Action {
  readonly type = REMOVE_REACTION;
  constructor(public payload: string) {}
}

export class SetObjectiveReaction implements Action {
  readonly type = SETOBJECTIVE_REACTION;
  constructor(public payload: string) {}
}

export class SetReactionBounds implements Action {
  readonly type = SETBOUNDS_REACTION;
  constructor(public payload: BoundsReaction) {}
}

export type InteractiveMapActions = SelectCard | NextCard | PreviousCard | TogglePlay | AddCard | DeleteCard | AddReaction | RemoveReaction | SetObjectiveReaction | SetReactionBounds;
