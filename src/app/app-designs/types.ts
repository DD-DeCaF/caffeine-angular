import {AddedReaction} from '../app-interactive-map/types';

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
}
