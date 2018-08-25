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
  model: Cobra.Model;
  addedReactions: string[];
  knockoutReactions: string[];
  objectiveReaction: ObjectiveReaction;
  bounds: {
    reactionId: string,
    lowerBound: number,
    upperBound: number,
  }[];
}

// Cobrapy object structures as defined by the JSON schema:
// https://github.com/opencobra/cobrapy/blob/devel/cobra/io/json.py#L138
export declare namespace Cobra {
  // A cobrapy model structure as serialized by `cobra.io.model_to_dict`
  export interface Model {
    id: string;
    name?: string;
    description?: string;
    version?: number;
    reactions: Reaction[];
    metabolites: Metabolite[];
    genes: {
      id: string;
      name: string;
      notes?: {
        [k: string]: any; // tslint:disable-line
      };
      annotation?: {
        [k: string]: any; // tslint:disable-line
      };
    }[];
    compartments?: {
      [k: string]: string;
    };
    notes?: {
      [k: string]: any; // tslint:disable-line
    };
    annotation?: {
      [k: string]: any; // tslint:disable-line
    };
  }

  // A cobrapy reaction as serialized by `cobra.io.dict.reaction_to_dict`
  export interface Reaction {
    id: string;
    name: string;
    metabolites: {
      [k: string]: number;
    };
    // The gene_reaction_rule is a boolean representation of the gene
    // requirements for this reaction to be active as described in
    // Schellenberger et al 2011 Nature Protocols 6(9):1290-307.
    // http://dx.doi.org/doi:10.1038/nprot.2011.308
    gene_reaction_rule: string;
    lower_bound: number;
    upper_bound: number;
    objective_coefficient?: number;
    variable_kind?: string;
    subsystem?: string;
    notes?: {
      [k: string]: any; // tslint:disable-line
    };
    annotation?: {
      [k: string]: any; // tslint:disable-line
    };
  }

  // A cobrapy metabolite as serialized by `cobra.io.dict.metabolite_to_dict`
  export interface Metabolite {
    id: string;
    name: string;
    compartment: string;
    charge?: number;
    formula?: string;
    _bound?: number;
    _constraint_sense?: string;
    notes?: {
      [k: string]: any; // tslint:disable-line
    };
    annotation?: {
      [k: string]: any; // tslint:disable-line
    };
  }
}

// DD-DeCaF platform internal structures
// tslint:disable-next-line
export declare namespace DeCaF {
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
      data?: Cobra.Reaction; // included if operation is 'add' or 'modify'
    }
  }

// Experimental conditions
// tslint:disable-next-line
declare namespace ExperimentalConditions {
  // A medium compound
  export interface Medium {
    id: string; // e.g. 'chebi:12345'
  }

  // A measurement object, used to make modifications to model based on experimental data
  export interface Measurement {
    id: string; // metabolite id (<database>:<id>, f.e. chebi:12345)
    type: 'compound' | 'reaction' | 'growth-rate' | 'protein';
    measurements: number[];
  }
}
