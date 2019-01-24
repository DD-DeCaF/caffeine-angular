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

import {PathwayMap} from '@dd-decaf/escher';

import * as fromInteractiveMapActions from './interactive-map.actions';
import {Card, CardType, OperationDirection, BoundedReaction, OperationTarget, Cobra, MapItem, AddedReaction, DeCaF, Species} from '../types';
import {appendOrUpdate, appendOrUpdateStringList} from '../../utils';
import {mapBiggReactionToCobra} from '../../lib';
import {debug} from '../../logger';


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
  selectedSpecies: Species;
  selectedModelHeader: DeCaF.ModelHeader;
  selectedModel: DeCaF.Model;
  selectedMap: MapItem;
  mapData: PathwayMap;
  cards: {
    ids: string[];
    cardsById: { [key: string]: Card; };
  };
}

export const emptyCard: Card = {
  name: 'foo',
  type: CardType.Design,
  model: null,
  solution: null,
  method: 'pfba',
  addedReactions: [],
  knockoutReactions: [],
  knockoutGenes: [],
  bounds: [],
  objectiveReaction: null,
  designId: null,
  model_id: null,
  projectId: null,
  methodCard: 'Manual',
  saved: null,
};

export const initialState: InteractiveMapState = {
  playing: false,
  selectedCardId: '0',
  selectedSpecies: null,
  selectedModelHeader: null,
  selectedModel: null,
  selectedMap: null,
  mapData: null,
  cards: {
    ids: [],
    cardsById: {},
  },
};

export const appendUnique = (array, item) => array.includes(item) ? array : [...array, item];

// TODO Here we have definition for equality and non-equaliyty check. These should be merged.
export const addedReactionEquality = (item: AddedReaction) => (arrayItem: AddedReaction) =>
  arrayItem.bigg_id === item.bigg_id;

export const boundEquality = (item: BoundedReaction) => (arrayItem: BoundedReaction) =>
  arrayItem.reaction.id === item.reaction.id;

const doOperations: { [key in OperationTarget]: (array: Card[key], item: Card[key][0]) => Card[key] } = {
  addedReactions: appendOrUpdate(addedReactionEquality),
  knockoutReactions: appendOrUpdateStringList,
  knockoutGenes: appendOrUpdateStringList,
  bounds: appendOrUpdate(boundEquality),
};

const stringFilter = (a: string) => (b: string) => a !== b;
const filter = <T>(predicate: (a: T) => (b: T) => boolean) => (array: T[], item: T) => array.filter(predicate(item));

type OperationFunction<T> = (array: T[], item: T) => T[];

const undoOperations: { [key in OperationTarget]: OperationFunction<Card[key][0]> } = {
  addedReactions: filter((a: AddedReaction) => (b: AddedReaction) => a.bigg_id !== b.bigg_id),
  knockoutReactions: filter<string>(stringFilter),
  knockoutGenes: filter<string>(stringFilter),
  bounds: filter((a: BoundedReaction) => (b: BoundedReaction) => a.reaction.id !== b.reaction.id),
};

const operations: { [key in OperationDirection]: { [tKey in OperationTarget]: OperationFunction<Card[tKey][0]> } } = {
  [OperationDirection.Do]: doOperations,
  [OperationDirection.Undo]: undoOperations,
};

export function interactiveMapReducer(
  state: InteractiveMapState = initialState,
  action: fromInteractiveMapActions.InteractiveMapActions,
): InteractiveMapState {
  debug('Action map:', action);
  switch (action.type) {
    case fromInteractiveMapActions.SET_SELECTED_SPECIES:
      return {
        ...state,
        selectedSpecies: action.payload,
      };
    case fromInteractiveMapActions.SET_MODEL:
      return {
        ...state,
        selectedModelHeader: action.payload,
      };
    case fromInteractiveMapActions.SET_FULL_MODEL:
      return {
        ...state,
        selectedModel: action.payload,
      };
    case fromInteractiveMapActions.MAP_FETCHED:
      return {
        ...state,
        // tslint:disable-next-line:no-any
        mapData: (<any> action.payload.mapData).map as PathwayMap,
        selectedMap: action.payload.mapItem,
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
    case fromInteractiveMapActions.ADD_CARD_FETCHED: {
      const newId = idGen.next();
      const {type, solution, design, pathwayPrediction} = action.payload;
      let name: string;
      let model: Cobra.Model;
      let model_id: number;
      let designId: number;
      let projectId: number;
      let saved: boolean;
      switch (type) {
        case CardType.Design: {
          if (design) {
            for (let i = 0; i < design.design.added_reactions.length; i++) {
              design.model.model_serialized.reactions.push(mapBiggReactionToCobra(design.design.added_reactions[i]));
              for (let j = 0; j < design.design.added_reactions[i].metabolites_to_add.length; j++) {
                design.model.model_serialized.metabolites.push(design.design.added_reactions[i].metabolites_to_add[j]);
              }
            }
          }
          designId = design ? design.id : pathwayPrediction ? pathwayPrediction.id : null;
          name = design ? design.name : pathwayPrediction ? pathwayPrediction.name : 'Design';
          model = design ? design.model.model_serialized : pathwayPrediction ? pathwayPrediction.model.model_serialized : state.selectedModel.model_serialized;
          model_id = design ? design.model_id : pathwayPrediction ? pathwayPrediction.model_id : state.selectedModel.id;
          projectId = design ? design.project_id : null;
          saved = !pathwayPrediction;
          break;
        }
        case CardType.DataDriven: {
          name = 'Data Driven';
          model = state.selectedModel.model_serialized;
          model_id = state.selectedModel.id;
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
              projectId,
              model_id,
              designId,
              solution,
              saved,
              addedReactions: design ? design.design.added_reactions : [],
              bounds: design ? design.design.constraints.map((reaction) => Object.assign({
                reaction: {id: reaction.id},
                lowerBound: reaction.lower_bound,
                upperBound: reaction.upper_bound,
              })) : [],
              knockoutReactions: design ? design.design.reaction_knockouts : pathwayPrediction ? pathwayPrediction.knockouts : [],
              knockoutGenes: design ? design.design.gene_knockouts : [],
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
    // TODO perhaps merge with the ones below
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
    case fromInteractiveMapActions.SET_OBJECTIVE_REACTION_APPLY:
    case fromInteractiveMapActions.SET_OPERATIONS:
    case fromInteractiveMapActions.SAVE_NEW_DESIGN: {
      const {selectedCardId: cardId} = state;
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
        case fromInteractiveMapActions.SAVE_NEW_DESIGN: {
          newCard = {
            ...card,
            designId: !card.designId ? action.payload.id : card.designId,
            saved: true,
          };
          break;
        }
        case fromInteractiveMapActions.REACTION_OPERATION_APPLY: {
          const {item, operationTarget, direction, saved} = action.payload;
          const operationFunction = operations[direction][operationTarget];
          const value = card[operationTarget];
          // @ts-ignore
          const result = operationFunction(value, item);
          if (operationTarget === 'addedReactions') {
            const addedReaction = mapBiggReactionToCobra(<AddedReaction>item);
            if (!card.model.reactions.includes(addedReaction)) {
              card.model.reactions.push(addedReaction);
            }
            const metabolitesToAdd = (<AddedReaction>item).metabolites_to_add;
            for (let i = 0; i < metabolitesToAdd.length; i++) {
              if (card.model.metabolites.indexOf(metabolitesToAdd[i]) === -1) {
                card.model.metabolites.push(metabolitesToAdd[i]);
              }
            }
          }

          newCard = {
            ...card,
            saved: saved || false,
            [operationTarget]: result,
          };
          break;
        }
        case fromInteractiveMapActions.SET_OPERATIONS: {
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
      /* tslint:disable */
      // @ts-ignore
      const solution = <DeCaF.Solution>action.solution;
      if (solution) {
        newCard.solution = solution;
      }
      /* tslint:enable */
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
