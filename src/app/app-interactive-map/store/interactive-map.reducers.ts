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
import {Card, CardType, ObjectiveReaction} from '../types';


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
        addedReactions: [],
        knockoutReactions: [],
        bounds: {},
        objectiveReaction: {
          cardId: '0',
          reactionId: '0',
          direction: null,
        },
      },
    },
  },
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
    case fromInteractiveMapActions.ADD_CARD: {
      const newId = idGen();
      const newCard: Card = {
        name: action.payload === CardType.WildType ? 'WildType' : 'DataDriven',
        type: action.payload,
        addedReactions: [],
        knockoutReactions: [],
        bounds: {},
        objectiveReaction: {
          cardId: '0',
          reactionId: '0',
          direction: null,
        },
      };
      return {
        ...state,
        cards: {
          ...state.cards,
          ids: [...state.cards.ids, newId],
          cardsById: {
            ...state.cards.cardsById,
            [newId]: newCard,
          },
        },
      };
    }
    case fromInteractiveMapActions.OPERATION_REACTION: {
      const {cardId, reactionId, operationTarget} = action.payload;
      const card = state.cards.cardsById[cardId];
      const newCard: Card = {
        ...card,
        // operationTarget: [...card[operationTarget], reactionId],
      };
      return {
        ...state,
        cards: {
          ...state.cards,
          cardsById: {
            ...state.cards.cardsById,
            [cardId]: newCard,
          },
        },
      };
    }
    case fromInteractiveMapActions.SETOBJECTIVE_REACTION: {
      const {cardId, reactionId, direction} = action.payload;
      const card = state.cards.cardsById[cardId];
      const newCard: Card = {
        ...card,
        objectiveReaction: {
          cardId: cardId,
          reactionId: reactionId,
          direction: direction,
        },
      };
      return {
        ...state,
        cards: {
          ...state.cards,
          cardsById: {
            ...state.cards.cardsById,
            [cardId]: newCard,
          },
        },
      };
    }
    case fromInteractiveMapActions.SETBOUNDS_REACTION: {
      const {cardId, reactionId, lowerBound, upperBound} = action.payload;
      const card = state.cards.cardsById[cardId];
      const newCard: Card = {
        ...card,
        bounds: {
          [reactionId]: {
            lowerBound: lowerBound,
            upperBound: upperBound,
          },
        },
      };
      return {
        ...state,
        cards: {
          ...state.cards,
          cardsById: {
            ...state.cards.cardsById,
            [cardId]: newCard,
          },
        },
      };
    }
   /* case fromInteractiveMapActions.UNDO_OPERATION_REACTION:
      return {
        ...state,
        addedReactions: state.addedReactions.filter((reaction) => {
          return reaction !== action.payload;
        }),
      };*/
    /*
  case fromInteractiveMapActions.REMOVE_KNOCKOUT_REACTION:
    return {
      ...state,
      knockoutReactions: state.knockoutReactions.filter((reaction) => {
      return reaction !== action.payload;
      }),
    };*/
    default:
      return state;
  }
}
