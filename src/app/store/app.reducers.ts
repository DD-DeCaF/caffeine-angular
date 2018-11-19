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

import {ActionReducerMap} from '@ngrx/store';

import {SessionState, sessionReducer} from '../session/store/session.reducers';
import {InteractiveMapState, interactiveMapReducer} from '../app-interactive-map/store/interactive-map.reducers';
import {designToolReducer, DesignToolState} from '../app-design-tool/store/design-tool.reducers';
import {loaderReducer, LoaderState} from '../app-interactive-map/components/loader/store/loader.reducers';
import {modelsReducer, ModelsState} from '../app-models/store/models.reducers';
import {sharedReducer, SharedState} from './shared.reducers';
import {mapsReducer, MapsState} from '../app-maps/store/maps.reducers';

export interface AppState {
  session: SessionState;
  interactiveMap: InteractiveMapState;
  designTool: DesignToolState;
  loader: LoaderState;
  models: ModelsState;
  shared: SharedState;
  maps: MapsState;
}

export const reducers: ActionReducerMap<AppState> = {
  session: sessionReducer,
  interactiveMap: interactiveMapReducer,
  designTool: designToolReducer,
  loader: loaderReducer,
  models: modelsReducer,
  shared: sharedReducer,
  maps: mapsReducer,
};

export const initialState: AppState = Object.assign(
  {},
  ...Object.entries(([key, reducer]) => ({
    [key]: reducer(),
  })),
);
