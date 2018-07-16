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
      set_gene_data(gene_data: GeneDataArray): void;
      renderSearchBar(hide?: boolean, searchItem?: string): void;
  }

  export function Builder(
      map_data?: PathwayMap,
      model_data?: any,
      embedded_css?: string,
      selection?: any,
      options?: any): BuilderObject;
}
