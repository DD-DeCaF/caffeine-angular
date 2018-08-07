import { createSelector } from '@ngrx/store';

import { AppState } from '../../store/app.reducers';
import { Card } from './interactive-map.reducers';

export interface HydratedCard extends Card {
  selected: boolean;
  id: string;
}

export const getHydratedCards = createSelector(
  (state: AppState) => state.interactiveMap.cards.cardsById,
  (state: AppState) => state.interactiveMap.selectedCardId,
  (cards: { [key: string]: Card; }, selectedID: string): HydratedCard[] =>
    Object.entries(cards).map(([id, card]) => ({
      ...card,
      selected: id === selectedID,
      id: id,
    })),
);
