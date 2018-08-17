import * as fromActions from './interactive-map.actions';
import {interactiveMapReducer, initialState} from './interactive-map.reducers';

import * as types from '../types';

fdescribe('interactiveMapReducer', () => {
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
        selectedCardId: '1',
        cards: {
          ids: ['0', '1'],
          cardsById: {
            ...initialState.cards.cardsById,
            '1': {
              type: types.CardType.WildType,
              name: 'Wild Type',
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
      });
  });
});
