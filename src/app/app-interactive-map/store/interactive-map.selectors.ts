import { createSelector } from '@ngrx/store';

import { AppState } from '../../store/app.reducers';
import { Card } from './interactive-map.reducers';

export interface HydratedCard extends Card {
  selected: boolean;
  id: string;
}

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
