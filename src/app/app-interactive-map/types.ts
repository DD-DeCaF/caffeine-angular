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

// Cobrapy json-serialization structures
declare namespace CobraPy {
  // A cobrapy model
  export interface Model {
    id: string;
    compartments: {
      [compartment: string]: string;
    };
    genes: {
      id: string;
      name: string;
    };
    reactions: Reaction[];
    metabolites: Metabolite[];
  }

  // A cobrapy reaction (as serialized by `cobra.io.dict.reaction_to_dict`)
  export interface Reaction {
    id: string;
    name: string;
    metabolites: {
      [id: string]: number;
    };
    lower_bound: number;
    upper_bound: number;
    // The gene_reaction_rule is a boolean representation of the gene
    // requirements for this reaction to be active as described in
    // Schellenberger et al 2011 Nature Protocols 6(9):1290-307.
    // http://dx.doi.org/doi:10.1038/nprot.2011.308
    gene_reaction_rule: string;
  }

  // A cobrapy metabolite (as serialized by `cobra.io.dict.metabolite_to_dict`)
  export interface Metabolite {
    id: string;
    name: string;
    compartment: string;
    formula: string;
    annotation: {
      [database: string]: string | string[];
    };
  }
}

// DD-DeCaF platform internal structures
declare namespace DeCaF {
  // The solution returned from a model simulation request
  export interface Solution {
    growth_rate: number;
    flux_distribution: {
      [reaction_id: string]: number;
    };
  }

  // Operation that can be applied to a model
  export interface Operation {
    operation: 'add' | 'modify' | 'remove';
    type: 'gene' | 'reaction';
    id: string;
      data?: CobraPy.Reaction; // included if operation is "add" or "modify"
    }
  }

// Experimental conditions
declare namespace ExperimentalConditions {
  // A medium compound
  export interface Medium {
    id: string; // e.g. "chebi:12345"
  }

  // A measurement object, used to make modifications to model based on experimental data
  export interface Measurement {
    id: string; // metabolite id (<database>:<id>, f.e. chebi:12345)
    type: 'compound' | 'reaction' | 'growth-rate' | 'protein';
    measurements: number[];
  }
}
