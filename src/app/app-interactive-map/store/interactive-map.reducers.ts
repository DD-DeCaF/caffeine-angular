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
import {PathwayMap} from '@dd-decaf/escher';

import {Card, CardType, OperationDirection, Bound, OperationTarget, Cobra, MapItem} from '../types';
import {appendOrUpdate, appendOrUpdateStringList} from '../../utils';
import { debug } from '../../logger';


class IdGen {
  counter = 0;

  next(): string {
    return '' + this.counter++;
  }

  reset(): void {
    this.counter = 0;
  }
}

export const idGen = new IdGen();

export interface InteractiveMapState {
  playing: boolean;
  selectedCardId: string;
  allSpecies: {project_id: string, id: string, name: string, created: string, updated: string}[];
  selectedSpecies: string;
  models: string[];
  selectedModel: string;
  modelData: Cobra.Model;
  maps: MapItem[];
  selectedMap: string;
  mapData: PathwayMap;
  cards: {
    ids: string[];
    cardsById: { [key: string]: Card; };
  };
}

export const emptyCard = {
  name: 'foo',
  type: CardType.WildType,
  model: null,
  method: 'fba',
  addedReactions: [],
  knockoutReactions: [],
  bounds: [],
  objectiveReaction: null,
};

export const initialState: InteractiveMapState = {
  playing: false,
  selectedCardId: '0',
  allSpecies: [
    {project_id: null, id: null, name: null, created: null, updated: null},
  ],
  selectedSpecies: null,
  models: null,
  selectedModel: null,
  modelData: null,
  maps: null,
  selectedMap: null,
  mapData: null,
  cards: {
    ids: [],
    cardsById: {},
  },
};


export const appendUnique = (array, item) => array.includes(item) ? array : [...array, item];

export const boundEquality = (item: Bound) => (arrayItem: Bound) =>
  arrayItem.reactionId === item.reactionId;

const doOperations: {[key in OperationTarget]: (array: Card[key], item: Card[key][0]) => Card[key]} = {
  addedReactions: appendOrUpdateStringList,
  knockoutReactions: appendOrUpdateStringList,
  bounds: appendOrUpdate(boundEquality),
};

const stringFilter = (a: string) => (b: string) => a !== b;
const filter = <T>(predicate: (a: T) => (b: T) => boolean) => (array: T[], item: T) => array.filter(predicate(item));

type OperationFunction<T> = (array: T[], item: T) => T[];

const undoOperations: {[key in OperationTarget]: OperationFunction<Card[key][0]>} = {
  addedReactions: filter<string>(stringFilter),
  knockoutReactions: filter<string>(stringFilter),
  bounds: filter((a: Bound) => (b: Bound) => a.reactionId !== b.reactionId),
};

const operations: {[key in OperationDirection]: {[tKey in OperationTarget]: OperationFunction<Card[tKey][0]>}} = {
  [OperationDirection.Do]: doOperations,
  [OperationDirection.Undo]: undoOperations,
};

export function interactiveMapReducer(
  state: InteractiveMapState = initialState,
  action: fromInteractiveMapActions.InteractiveMapActions,
): InteractiveMapState {
  debug('Action:', action);
  switch (action.type) {
    case fromInteractiveMapActions.SET_SPECIES:
      return {
        ...state,
        allSpecies: action.payload,
      };
    /* tslint:disable */
    case fromInteractiveMapActions.SET_SELECTED_SPECIES:
      return {
        ...state,
        selectedSpecies: action.payload,
      };
    /* tslint:enable */
    case fromInteractiveMapActions.SET_MODELS:
      return {
        ...state,
        models: action.payload,
      };
    case fromInteractiveMapActions.MODEL_FETCHED:
      return {
        ...state,
        selectedModel: action.payload.modelId,
        modelData: action.payload.model,
      };
    case fromInteractiveMapActions.SET_MAPS:
      return {
        ...state,
        maps: action.payload,
      };
    case fromInteractiveMapActions.MAP_FETCHED:
      return {
        ...state,
        mapData: action.payload.mapData,
        selectedMap: action.payload.mapName,
      };
    case fromInteractiveMapActions.RESET_CARDS:
      return {
        ...state,
        cards: {
          ...state.cards,
          ids: [],
          cardsById: {},
        },
      };
    case fromInteractiveMapActions.SELECT_CARD:
      return {
        ...state,
        selectedCardId: action.payload,
      };
    case fromInteractiveMapActions.SET_PLAY_STATE:
      return {
        ...state,
        playing: action.payload,
      };
    case fromInteractiveMapActions.ADD_CARD: {
      const newId = idGen.next();
      const type = action.payload;
      let name: string;
      let model: Cobra.Model;
      switch (type) {
        case CardType.WildType: {
          name = 'Wild Type';
          model = state.modelData;
          break;
        }
        case CardType.DataDriven: {
          name = 'Data Driven';
          break;
        }
        default:
      }
      return {
        ...state,
        selectedCardId: newId,
        cards: {
          ...state.cards,
          ids: [...state.cards.ids, newId],
          cardsById: {
            ...state.cards.cardsById,
            [newId]: {
              ...emptyCard,
              type,
              name,
              model,
            },
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
    case fromInteractiveMapActions.RENAME_CARD:
      return {
        ...state,
        cards: {
          ...state.cards,
          cardsById: {
            ...state.cards.cardsById,
            [state.selectedCardId]: {
              ...state.cards.cardsById[state.selectedCardId],
              name: action.payload,
            },
          },
        },
      };
    case fromInteractiveMapActions.SET_METHOD_APPLY:
    case fromInteractiveMapActions.REACTION_OPERATION_APPLY:
    case fromInteractiveMapActions.SET_OBJECTIVE_REACTION_APPLY: {
      const {cardId} = action;
      const {[cardId]: card} = state.cards.cardsById;
      let newCard: Card;
      switch (action.type) {
        case fromInteractiveMapActions.SET_METHOD_APPLY: {
          newCard = {
            ...card,
            method: action.payload,
          };
          break;
        }
        case fromInteractiveMapActions.REACTION_OPERATION_APPLY: {
          const {item, operationTarget, direction} = action.payload;
          const operationFunction = operations[direction][operationTarget];
          const value = card[operationTarget];
          // @ts-ignore
          const result = operationFunction(value, item);
          newCard = {
            ...card,
            [operationTarget]: result,
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
