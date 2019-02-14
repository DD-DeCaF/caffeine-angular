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

const applyActions = (actions: fromActions.InteractiveMapActions[]): InteractiveMapState =>
  actions.reduce(
    (prevState: InteractiveMapState, action) => interactiveMapReducer(prevState, action),
    undefined,
  );

const addedReaction: types.AddedReaction = {
  bigg_id: 'asd',
  name: 'asd',
  organism: '',
  metanetx_id: null,
  reaction_string: null,
  metabolites: {},
  metabolites_to_add: {},
  database_links: {},
  model_bigg_id: '',
};

const testModelHeader: types.DeCaF.ModelHeader = {
  id: 0,
  name: 'Foo',
  organism_id: null,
};

const testModel: types.DeCaF.Model = {
  ...testModelHeader,
  created: 'now',
  model_serialized: {
    id: '0',
    reactions: [],
    metabolites: [],
    genes: [],
  },
  default_biomass_reaction: 'bar',
  preferred_map_id: 1,
};

const testSolution: types.DeCaF.Solution = {
  growth_rate: 0,
  flux_distribution: {},
};

const testSpecies: types.Species = {project_id: null, id: 2, name: 'Escherichia coli', created: '2018-07-04T15:22:05.701458', updated: null};

const testAddCard = (type: types.CardType): fromActions.AddCardFetched =>
  new fromActions.AddCardFetched({type, solution: testSolution});

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
    const actions = [
      new fromActions.SetModel(testModelHeader),
      new fromActions.SetFullModel(testModel),
      testAddCard(types.CardType.Design),
    ];

    expect(applyActions(actions))
      .toEqual({
        ...initialState,
        selectedModelHeader: testModelHeader,
        selectedModel: testModel,
        selectedCardId: '0',
        cards: {
          ids: ['0'],
          cardsById: {
            '0': {
              name: 'Design',
              type: types.CardType.Design,
              model: testModel.model_serialized,
              species: null,
              solution: testSolution,
              method: 'pfba',
              addedReactions: [],
              knockoutReactions: [],
              knockoutGenes: [],
              bounds: [],
              objectiveReaction: null,
              designId: null,
              model_id: 0,
              projectId: null,
              methodCard: 'Manual',
              experiment: null,
              condition: null,
              measurements: [],
              medium: [],
              genotype: [],
              saved: true,
              solutionUpdated: false,
              operations: [],
            },
          },
        },
      });
  });

  it('should delete card', () => {
    const actions = [
      new fromActions.SetModel(testModelHeader),
      new fromActions.SetFullModel(testModel),
      testAddCard(types.CardType.Design),
      testAddCard(types.CardType.Design),
      new fromActions.DeleteCard('0'),
    ];
    const state = applyActions(actions);
    expect(Array.from(Object.keys(state.cards.cardsById))).toEqual(['1']);
  });

  it('should add new reaction', () => {
    const operationPayload: types.AddedReactionPayload = {
      item: {
        ...addedReaction,
        bigg_id: 'asd',
      },
      direction: types.OperationDirection.Do,
      operationTarget: 'addedReactions',
    };

    const actions = [
      new fromActions.SetModel(testModelHeader),
      new fromActions.SetFullModel(testModel),
      testAddCard(types.CardType.Design),
      new fromActions.ReactionOperationApply(operationPayload),
    ];

    const state = applyActions(actions);

    expect(state.cards.cardsById['0'].addedReactions[0].bigg_id).toEqual('asd');
  });

  it('should remove the added reaction', () => {
    const actions = [
      new fromActions.SetModel(testModelHeader),
      new fromActions.SetFullModel(testModel),
      testAddCard(types.CardType.Design),
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
    const state = applyActions(actions);
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

  it('should set the selected specie', () => {
    const state = interactiveMapReducer(
      undefined,
      new fromActions.SetSelectedSpecies(testSpecies),
    );
    expect(state.selectedSpecies).toEqual(testSpecies);
  });
});
