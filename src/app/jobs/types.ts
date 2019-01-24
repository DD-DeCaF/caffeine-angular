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

import {Cobra, DeCaF} from '../app-interactive-map/types';
import Metabolite = Cobra.Metabolite;

export interface Job {
  id: number;
  started: Date;
  completed?: Date;
  state: string;
  error?: string;
  type?: string;
  data: PathwayPrediction;
  model_id: number;
  model?: DeCaF.Model;
}

export interface PathwayPrediction {
  type: 'Pathway prediction';
  organism: string;
  product: string;
  model: string;
  numberOfPathways: number;
}

export interface PathwayPredictionResult {
  id: number;
  host: string;
  model: DeCaF.Model;
  manipulations?: {
    direction: 'delta' | 'down' | 'up';
    value: string;
    id: string;
  }[];
  knockouts: string[];
  heterologous_reactions: string[];
  fitness: number;
  yield: number;
  product: number;
  biomass: number;
  exotic_cofactors: string[];
  method: string;
  synthetic_reactions: string[];
  name?: string;
  model_id?: number;
}

export interface PathwayPredictionReactions {
  annotation: {
    Description: string;
    EC: string;
   };
  gene_reaction_rule: string;
  id: string;
  lower_bound: number;
  metabolites: Metabolite[];
  name: string;
  upper_bound: number;
}

export interface PathwayResponse {
  created: string;
  id: number;
  max_predictions: number;
  model_id: number;
  organism_id: number;
  product_name: string;
  status: string;
  project_id: number;
  type?: string;
  result: {
    reactions: PathwayPredictionReactions[];
    diff_fva: PathwayPredictionResult[];
    cofactor_swap: PathwayPredictionResult[];
    opt_gene: PathwayPredictionResult[];
    metabolites;
  };
  updated: string;
}

export interface Manipulation {
  direction: string;
  id: string;
  value: number;
}
