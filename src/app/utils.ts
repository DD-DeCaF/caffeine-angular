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

// This file contains the most generic extensions to javascript
// It should preferably not depend on any other code, just the standard javascipt
// If in doubt about where to put a certain helper, think about if it could be published.
// If it's too specific to this application, place it in lib, else utils.

export const notNull = (data) => data !== null;

export const appendOrUpdate = <T>(predicate: (a: T) => (b: T) => boolean) => (array: T[], item: T) => {
  const oldIndex = array.findIndex(predicate(item));
  const index = oldIndex > -1 ? oldIndex : array.length;
  const newArray = [...array];
  newArray.splice(index, 1, item);
  return newArray;
};

export const appendOrUpdateStringList = appendOrUpdate<string>((a) => (b) => a === b);

// tslint:disable:no-any
export const objectFilter = (
    predicate: (key: string, value: any) => boolean,
  ) => (obj: {[key: string]: any}) =>
    Object.assign(
      {},
      ...Object.entries(obj)
        .filter(([key, value]) => predicate(key, value))
        .map(([key, value]) => ({[key]: value})),
    );
// tslint:enable:no-any

export const firstIfContains = (items: string[], item) =>
  [...items].sort((a, b) => b === item ? 1 : -1);

export const unique = <T>(items: T[]): T[] => Array.from(new Set(items));

const createComparator = <T>(matchItem: Partial<T>) => (item: T): boolean =>
  Object.entries(matchItem)
  .map(([key, value]) => item[key] === value)
  .every((v) => v);

const matchSelector = <T>(comparators: ((item: T) => boolean)[]) => (items: T[]) =>
  comparators.reduce(
    (prev: T, comparator: (item: T) => boolean) => prev || items.find(comparator),
    undefined,
  );

export const objectMatcher = <T>(matchers: Partial<T>[]) => (items: T[]) =>
  matchSelector(matchers.map(createComparator))(items);
