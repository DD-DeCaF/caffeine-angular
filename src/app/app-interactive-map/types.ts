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

export enum CardType {
  WildType,
  DataDriven,
}

export interface Reaction {
  bigg_id: string;
  name: string;
  model_bigg_id: string;
  organism: string;
}

export interface Reactions {
  added: Reaction[];
  removed: Reaction[];
  objective: {
    reaction: Reaction,
    direction: string,
  };
  changed: Reaction[];
}

export interface Bound {
  reactionId: string;
  lowerBound: number;
  upperBound: number;
}

export enum OperationDirection {
  Do = 'DO',
  Undo = 'UNDO',
}

export type SimpleOperationTarget = 'addedReactions' | 'knockoutReactions';
export type BoundOperationTarget = 'bounds';

export type OperationTarget = SimpleOperationTarget| BoundOperationTarget;

export interface SimpleOperationPayload {
  item: string;
  operationTarget: OperationTarget;
  direction: OperationDirection;
}

export interface BoundOperationPayload {
  item: Bound;
  operationTarget: BoundOperationTarget;
  direction: OperationDirection;
}
export type OperationPayload = SimpleOperationPayload | BoundOperationPayload;
export interface ObjectiveReactionPayload {
  direction: 'min' | 'max';
  reactionId: string;
}

export type ObjectiveReaction = ObjectiveReactionPayload;

export interface Card {
  type: CardType;
  name: string;
  addedReactions: string[];
  knockoutReactions: string[];
  objectiveReaction: ObjectiveReaction;
  bounds: {
    reactionId: string,
    lowerBound: number,
    upperBound: number,
  }[];
}
