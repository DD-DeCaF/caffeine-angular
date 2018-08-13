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
