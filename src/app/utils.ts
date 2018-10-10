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

import * as types from './app-interactive-map/types';

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

export const mapBiggReactionToCobra = ({
                                         bigg_id,
                                         reaction_string,
                                         name,
                                         metabolites}: types.AddedReaction,
                                       bounds: {lowerBound?: number, upperBound?: number}= {lowerBound: -1000, upperBound: 1000}): types.Cobra.Reaction =>
  ({
    name: name,
    id: bigg_id,
    gene_reaction_rule: reaction_string,
    lower_bound: bounds.lowerBound,
    upper_bound: bounds.upperBound,
    metabolites: metabolites,
  });
