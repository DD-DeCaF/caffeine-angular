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
import {Card, CardType, OperationDirection} from '../types';


class IdGen {
  counter = 1;

  next(): string {
    return '' + this.counter++;
  }

  reset(): void {
    this.counter = 1;
  }
}

export const idGen = new IdGen();

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

export const initialState: InteractiveMapState = {
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
      const newId = idGen.next();
      const newCard: Card = {
        name: action.payload === CardType.WildType ? 'Wild Type' : 'Data Driven',
        type: action.payload,
        addedReactions: [],
        knockoutReactions: [],
        bounds: {},
        objectiveReaction: {
          reactionId: '0',
          direction: null,
        },
      };
      return {
        ...state,
        selectedCardId: newId,
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
    case fromInteractiveMapActions.DELETE_CARD: {
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
    }
    case fromInteractiveMapActions.REACTION_OPERATION_APPLY:
    case fromInteractiveMapActions.SET_OBJECTIVE_REACTION_APPLY:
    case fromInteractiveMapActions.SET_BOUNDS_REACTION_APPLY: {
      const {cardId} = action;
      const {[cardId]: card} = state.cards.cardsById;
      let newCard: Card;
      switch (action.type) {
        case fromInteractiveMapActions.REACTION_OPERATION_APPLY: {
          const {reactionId, operationTarget, direction} = action.payload;
          newCard = {
            ...card,
            [operationTarget]: direction === OperationDirection.Do
              ? [...card[operationTarget], reactionId]
              : card[operationTarget].filter((rId) => rId !== reactionId),
          };
          break;
        }
        case fromInteractiveMapActions.SET_OBJECTIVE_REACTION_APPLY: {
          const {reactionId, direction} = action.payload;
          newCard = {
            ...card,
            objectiveReaction: {
              reactionId,
              direction,
            },
          };
          break;
        }
        case fromInteractiveMapActions.SET_BOUNDS_REACTION_APPLY: {
          const {reactionId, lowerBound, upperBound} = action.payload;
          newCard = {
            ...card,
            bounds: {
              ...card.bounds,
              [reactionId]: {
                lowerBound,
                upperBound,
              },
            },
          };
          break;
        }
        default:
      }
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
    default:
      return state;
  }
}
