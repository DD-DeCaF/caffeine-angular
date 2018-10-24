import * as types from '../app-interactive-map/types';

export interface EditModel {
  id: number;
  organism_id: number;
  name: string;
  default_biomass_reaction: string;
}

export interface AddModel {
  name: string;
  organism_id: number;
  project_id: number;
  default_biomass_reaction: string;
  model_serialized: types.Cobra.Model;
}

export interface Project {
  name: string;
  id: string;
}
