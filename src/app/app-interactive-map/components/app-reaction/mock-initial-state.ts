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

import { initialState as IMInitialState, InteractiveMapState, emptyCard } from '../../store/interactive-map.reducers';
import { initialState as SInitialState } from '../../../session/store/session.reducers';
import { initialState as DTInitialState } from '../../../app-design-tool/store/design-tool.reducers';

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
  designTool: DTInitialState,
};
