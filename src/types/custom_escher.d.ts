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
declare module '@dd-decaf/escher' {
  export interface MetaData {
      map_name: string;
      map_id: string;
      homepage: string;
      schema: string;
  }

  export interface MapData {
      reactions: {
          [k: number]: any;
      };
      nodes: {
          [k: number]: any;
      };
      text_labels: {
          [k: number]: any;
      };
      canvas: {
          x: number;
          y: number;
          width: number;
          height: number;
      };
  }

  export interface GeneData {
      [k: string]: number;
  }

  export type GeneDataArray = [GeneData];

  export type PathwayMap = [MetaData, MapData];
  export interface BuilderObject {
      load_map(map_data: PathwayMap): void;
      load_model(model: any): void;
      set_gene_data(gene_data: GeneDataArray): void;
      renderSearchBar(hide?: boolean, searchItem?: string): void;
      set_reaction_data(flux: any): void;
      set_knockout_reactions(reactions: string[]): void;
      set_reaction_fva_data(flux: any): void;
      set_added_reactions(reactions: string[]): void;
      set_highlight_reactions(reactions: string[]): void;
      set_knockout_genes(genes: string[]): void;
      _update_data(
          update_model: boolean,
          update_map: boolean,
          kind?: string,
          should_draw?: boolean,
        ): void;
  }

  export function Builder(
      map_data?: PathwayMap,
      model_data?: any,
      embedded_css?: string,
      selection?: any,
      options?: any): BuilderObject;
}
