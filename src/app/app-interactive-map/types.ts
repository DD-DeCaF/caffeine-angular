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

export interface OperationPayload {
  cardId: string;
  reactionId: string;
  operationTarget?: 'addedReactions' | 'knockoutReactions' | 'objectiveReaction' | 'changedReaction';
}

export interface BoundsReaction extends OperationPayload {
  lowerBound: number;
  upperBound: number;
}

export interface ObjectiveReaction extends OperationPayload {
  direction: string;
}

export interface Card {
  type: CardType;
  name: string;
  addedReactions: string[];
  knockoutReactions: string[];
  objectiveReaction: ObjectiveReaction;
  bounds: {
    [reactionId: string]: {
      lowerBound: number;
      upperBound: number;
    };
  };
}
