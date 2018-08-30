import { initialState as IMInitialState, InteractiveMapState, emptyCard } from '../../store/interactive-map.reducers';
import { initialState as SInitialState } from '../../../session/store/session.reducers';
import { AppState } from '../../../store/app.reducers';

const mockedIMInitialState: InteractiveMapState = {
  ...IMInitialState,
  cards: {
    ids: ['0'],
    cardsById: {
      '0': {
        ...emptyCard,
        objectiveReaction: {
          reactionId: 'fooBar',
          direction: 'max',
        },
      },
    },
  },
};

export const initialState: AppState = {
  interactiveMap: mockedIMInitialState,
  session: SInitialState,
};
