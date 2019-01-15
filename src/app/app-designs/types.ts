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

import {AddedReaction, DeCaF} from '../app-interactive-map/types';
import ModelHeader = DeCaF.ModelHeader;

export interface DesignRequest {
  design: {
    constraints: [
      {
        id: string;
        lower_bound: number;
        upper_bound: number;
      }
      ],
    gene_knockouts: string[];
    reaction_knockins: string[];
    reaction_knockouts: string[];
    added_reactions?: AddedReaction[];
  };
  id: number;
  model_id: number;
  name: string;
  project_id: number;
  model?: DeCaF.Model;
  modelHeader?: ModelHeader;
}
