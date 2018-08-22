import * as fromActions from './interactive-map.actions';
import {interactiveMapReducer, initialState, InteractiveMapState, idGen} from './interactive-map.reducers';

import * as types from '../types';

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
              bounds: [],
              objectiveReaction: {
                reactionId: '0',
                direction: null,
              },
            },
          },
        },
      });
  });

  it('should delete card', () => {
    const state = interactiveMapReducer(undefined, new fromActions.AddCard(types.CardType.WildType));
    const newState = interactiveMapReducer(state, new fromActions.DeleteCard('0'));
    expect(Array.from(Object.keys(newState.cards.cardsById))).toEqual(['1']);
  });

  it('should add new reaction', () => {
    const state = interactiveMapReducer(
      undefined,
      new fromActions.ReactionOperationApply({
        item: 'asd',
        direction: types.OperationDirection.Do,
        operationTarget: 'addedReactions',
      }, '0'),
    );
    expect(state.cards.cardsById['0'].addedReactions).toEqual(['asd']);
  });

  it('should remove the added reaction', () => {
    const actions = [
      new fromActions.ReactionOperationApply({
        item: 'asd',
        direction: types.OperationDirection.Do,
        operationTarget: 'addedReactions',
      }, '0'),
      new fromActions.ReactionOperationApply({
        item: 'foobar',
        direction: types.OperationDirection.Do,
        operationTarget: 'addedReactions',
      }, '0'),
      new fromActions.ReactionOperationApply({
        item: 'asd',
        direction: types.OperationDirection.Undo,
        operationTarget: 'addedReactions',
      }, '0'),
    ];
    const state = actions.reduce(
      (prevState: InteractiveMapState, action) => interactiveMapReducer(prevState, action),
      undefined,
    );
    expect(state.cards.cardsById['0'].addedReactions).toEqual(['foobar']);
  });

  it('should set the objective reaction', () => {
    const state = interactiveMapReducer(
      undefined,
      new fromActions.SetObjectiveReactionApply({
        reactionId: 'asd',
        direction: 'min',
      }, '0'),
    );
    expect(state.cards.cardsById['0'].objectiveReaction).toEqual({
      reactionId: 'asd',
      direction: 'min',
    });
  });
});
