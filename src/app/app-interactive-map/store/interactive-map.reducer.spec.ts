// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as fromActions from './interactive-map.actions';
import {interactiveMapReducer, initialState, InteractiveMapState, idGen} from './interactive-map.reducers';

import * as types from '../types';

const addedReaction: types.AddedReaction = {
  bigg_id: 'asd',
  name: 'asd',
  organism: '',
  metanetx_id: null,
  reaction_string: null,
  metabolites: {},
  database_links: {},
  model_bigg_id: '',
};

describe('interactiveMapReducer', () => {
  beforeEach(() => {
    idGen.reset();
  });

  it('should return the initial state', () => {
    expect(interactiveMapReducer(undefined, new fromActions.NextCard()))
      .toEqual(initialState);
  });

  it('should change the selected card', () => {
    const newId = '5';
    expect(interactiveMapReducer(undefined, new fromActions.SelectCard(newId)))
    .toEqual({...initialState, selectedCardId: newId});
  });

  it('should add a new card', () => {
    expect(interactiveMapReducer(undefined, new fromActions.AddCard(types.CardType.WildType)))
      .toEqual({
        ...initialState,
        selectedCardId: '0',
        cards: {
          ids: ['0'],
          cardsById: {
            '0': {
              name: 'Wild Type',
              type: types.CardType.WildType,
              model: null,
              solution: null,
              method: 'fba',
              addedReactions: [],
              knockoutReactions: [],
              bounds: [],
              objectiveReaction: null,
            },
          },
        },
      });
  });

  it('should delete card', () => {
    const state1 = interactiveMapReducer(undefined, new fromActions.AddCard(types.CardType.WildType));
    const state2 = interactiveMapReducer(state1, new fromActions.AddCard(types.CardType.WildType));
    const state3 = interactiveMapReducer(state2, new fromActions.DeleteCard('0'));
    expect(Array.from(Object.keys(state3.cards.cardsById))).toEqual(['1']);
  });

  it('should add new reaction', () => {
    const state1 = interactiveMapReducer(undefined, new fromActions.AddCard(types.CardType.WildType));
    const state2 = interactiveMapReducer(
      state1,
      new fromActions.ReactionOperationApply({
        item: {
          ...addedReaction,
          bigg_id: 'asd',
        },
        direction: types.OperationDirection.Do,
        operationTarget: 'addedReactions',
      }),
    );
    expect(state2.cards.cardsById['0'].addedReactions[0].bigg_id).toEqual('asd');
  });

  it('should remove the added reaction', () => {
    const actions = [
      new fromActions.AddCard(types.CardType.WildType),
      new fromActions.ReactionOperationApply({
        item: {
          ...addedReaction,
          bigg_id: 'asd',
        },
        direction: types.OperationDirection.Do,
        operationTarget: 'addedReactions',
      }),
      new fromActions.ReactionOperationApply({
        item: {
          ...addedReaction,
          bigg_id: 'foobar',
        },
        direction: types.OperationDirection.Do,
        operationTarget: 'addedReactions',
      }),
      new fromActions.ReactionOperationApply({
        item: {
          ...addedReaction,
          bigg_id: 'asd',
        },
        direction: types.OperationDirection.Undo,
        operationTarget: 'addedReactions',
      }),
    ];
    const state = actions.reduce(
      (prevState: InteractiveMapState, action) => interactiveMapReducer(prevState, action),
      undefined,
    );
    expect(state.cards.cardsById['0'].addedReactions[0].bigg_id).toEqual('foobar');
  });

  it('should set the objective reaction', () => {
    const state = interactiveMapReducer(
      undefined,
      new fromActions.SetObjectiveReactionApply({
        reactionId: 'asd',
        direction: 'min',
      }),
    );
    expect(state.cards.cardsById['0'].objectiveReaction).toEqual({
      reactionId: 'asd',
      direction: 'min',
    });
  });
});
