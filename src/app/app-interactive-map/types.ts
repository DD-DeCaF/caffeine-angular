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

export interface ObjectiveReaction {
  reaction: Reaction;
  direction: string;
}

export interface Card {
  type: CardType;
  name: string;
  addedReactions: string[];
  knockoutReactions: string[];
  objectiveReaction: string;
  bounds: {
    [reactionId: string]: {
      lowerBound: number;
      upperBound: number;
    };
  };
}
