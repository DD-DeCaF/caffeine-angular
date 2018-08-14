// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as fromInteractiveMapActions from './interactive-map.actions';
import {CardType, Reaction} from '../types';
import { stat } from 'fs';

export interface Card {
  type: CardType;
  name: string;
}

const idGen = (() => {
  let counter = 1;
  return () => '' + counter++;
})();

export interface InteractiveMapState {
  playing: boolean;
  selectedCardId: string;
  allSpecies: { [key: string]: string; };
  selectedSpecies: string;
  models: string[];
  selectedModel: string;
  maps: { [key: string]: string[]; };
  cards: {
    ids: string[];
    cardsById: { [key: string]: Card; };
  };
  addedReactions: string[];
  removedReactions: string[];
  objectiveReaction: string;
  bounds: {
    [reactionId: string]: {
      lowerBound: number;
      upperBound: number;
    };
  };
}

const initialState: InteractiveMapState = {
  playing: false,
  selectedCardId: '0',
  allSpecies: {
    ECOLX: 'Escherichia coli',
    YEAST: 'Saccharomyces cerevisiae',
    PSEPU: 'Pseudomonas putida',
  },
  selectedSpecies: 'ECOLX',
  models: ['iJO1366', 'e_coli_core'],
  selectedModel: 'iJO1366',
  maps: {
    e_coli_core: ['Core metabolism'],
    iJN746: ['Central metabolism'],
    iMM904: ['Amino acid metabolism', 'Central metabolism', 'Cofactor and vitamin biosynthesis', 'Combined', 'Lipid metabolism',
      'Nucleotide metabolism'],
    iJO1366: ['Alternate carbon sources', 'Amino acid metabolism', 'Central metabolism', 'Cofactor biosynthesis', 'Combined',
      'Fatty acid beta-oxidation', 'Fatty acid biosynthesis (saturated)', 'Lipopolysaccharide (LPS) biosynthesis',
      'Nucleotide and histidine biosynthesis', 'Nucleotide metabolism', 'tRNA charging'],
  },
  cards: {
    ids: ['0'],
    cardsById: {
      '0': {
        name: 'foo',
        type: CardType.WildType,
      },
    },
  },
  addedReactions: [],
  removedReactions: [],
  bounds: {},
  objectiveReaction: '',
};

export function interactiveMapReducer(
  state: InteractiveMapState = initialState,
  action: fromInteractiveMapActions.InteractiveMapActions,
): InteractiveMapState {
  switch (action.type) {
    case fromInteractiveMapActions.SELECT_CARD:
      return {
        ...state,
        selectedCardId: action.payload,
      };
    case fromInteractiveMapActions.TOGGLE_PLAY:
      return {
        ...state,
        playing: !state.playing,
      };
    case fromInteractiveMapActions.ADD_CARD:
      const newId = idGen();
      return {
        ...state,
        selectedCardId: newId,
        cards: {
          ...state.cards,
          ids: [...state.cards.ids, newId],
          cardsById: {
            ...state.cards.cardsById,
            [newId]: {
              name: action.payload === CardType.WildType ? 'WildType' : 'DataDriven',
              type: action.payload,
            },
          },
        },
      };
    case fromInteractiveMapActions.DELETE_CARD:
      if (state.cards.ids.length < 2) {
        return state;
      }
      const ids = state.cards.ids.filter((id) => id !== action.payload);
      const selectedCardId = action.payload === state.selectedCardId
        ? ids[0]
        : state.selectedCardId;
      const {[action.payload]: card, ...cardsById} = state.cards.cardsById;
      return {
        ...state,
        selectedCardId,
        cards: {
          ...state.cards,
          ids,
          cardsById,
        },
      };
    case fromInteractiveMapActions.ADD_REACTION:
      return {
        ...state,
        addedReactions: [...state.addedReactions, action.payload],
      };
    case fromInteractiveMapActions.REMOVE_REACTION:
      return {
        ...state,
        removedReactions: [...state.removedReactions, action.payload],
      };
    case fromInteractiveMapActions.SETOBJECTIVE_REACTION:
      return {
        ...state,
        objectiveReaction: action.payload,
      };
    case fromInteractiveMapActions.SETBOUNDS_REACTION:
      return {
        ...state,
        bounds: {
          [action.payload.id]: {
            lowerBound: action.payload.lowerBound,
            upperBound: action.payload.upperBound,
          },
        },
      };
    default:
      return state;
  }
}
