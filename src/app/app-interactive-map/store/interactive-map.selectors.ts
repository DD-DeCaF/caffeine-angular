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

import {createSelector, createSelectorFactory, defaultMemoize} from '@ngrx/store';
import {AppState} from '../../store/app.reducers';
import {Card, HydratedCard} from '../types';

const isEqualOrNull = (a: any, b: any): boolean => // tslint:disable-line
  a === b || b === null;

const createSelectorNotNull = createSelectorFactory((projectionFn) =>
  defaultMemoize(projectionFn, isEqualOrNull));

export const getCardIds = (state: AppState) => state.interactiveMap.cards.ids;

export const getHydratedCards = createSelector(
  getCardIds,
  (state: AppState) => state.interactiveMap.cards.cardsById,
  (state: AppState) => state.interactiveMap.selectedCardId,
  (ids: string[], cards: { [key: string]: Card; }, selectedID: string): HydratedCard[] =>
  ids.map((id) => ({
      ...cards[id],
      selected: id === selectedID,
      id: id,
    })),
);

export const getSelectedCard = createSelectorNotNull(
  (state: AppState) => state.interactiveMap.cards.cardsById,
  (state: AppState) => state.interactiveMap.selectedCardId,
  (cards: { [key: string]: Card; }, selectedID: string): HydratedCard =>
    cards[selectedID] ? ({
      ...cards[selectedID],
      id: selectedID,
      selected: true,
    }) : null,
);
