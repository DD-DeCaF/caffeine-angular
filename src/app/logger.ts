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

import {environment} from '../environments/environment';

class IGAEvent {
  public category?: string;
  public action?: string;
  public label?: string;
  public value?: string;
}

export class GAEvent extends IGAEvent {
  constructor(event: IGAEvent) {
    super();
    Object.assign(
      this,
      {
        category: null,
        action: null,
        label: null,
        value: null,
      },
      event,
    );
  }
}

// tslint:disable-next-line:no-any
export const debug = (...args: any[]): void => {
  if (!environment.production) {
    console.log('Debug:', ...args);
  }
};

/**
 * It is often required to prefix the log messages somehow.
 * It's useful for filtering them in the developer console.
 * This method provides a convenient way to create a curried logger.
 * @param tag the prefix for the log messages
 */
export const debugC = (tag: string): (...args: string[]) => void =>
    (...args: string[]): void => {
      debug(tag, ...args);
    };

export function info(gaEvent: GAEvent): void;
// tslint:disable-next-line:no-any
export function info(...args: any[]): void {
  if (!environment.production) {
    console.log('Info:', ...args);
  }
  if (environment.GA) {
    // More info about GA:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    const [gaEvent, ...rest] = args;
    if (rest.length === 1 && gaEvent instanceof GAEvent) {
      ga('send', 'event', gaEvent.category, gaEvent.action, gaEvent.label, gaEvent.value);
    }
  }
}

// tslint:disable-next-line:no-any
export const warning = (...args: any[]): void => {
  if (!environment.production) {
    console.warn(...args);
  }
};

/**
 * error: will raise an exception
 */
// tslint:disable-next-line:no-any
export const error = (...args: any[]): void => {
  console.error(...args);
};
