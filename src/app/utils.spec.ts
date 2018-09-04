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

import {
  appendOrUpdate,
  appendOrUpdateStringList,
  notNull,
  objectFilter,
  firstIfContains,
  unique,
} from './utils';

describe('notNull', () => {
  it('should be true for no null items', () => {
    expect(notNull(undefined)).toBeTruthy();
    expect(notNull(NaN)).toBeTruthy();
    expect(notNull(0)).toBeTruthy();
    expect(notNull(1)).toBeTruthy();
    expect(notNull('')).toBeTruthy();
    expect(notNull('sdf')).toBeTruthy();
    expect(notNull([])).toBeTruthy();
    expect(notNull({})).toBeTruthy();
  });

  it('should be false for null', () => {
    expect(notNull(null)).toBeFalsy();
  });
});

describe('appendOrUpdate', () => {
  interface Foo {
    bar: string;
    baz: number;
  }
  let predicate: (a: Foo) => (b: Foo) => boolean;
  let array: Foo[];

  beforeEach(() => {
    predicate = (a) => (b) => a.bar === b.bar;
    array = [
      {bar: 'a', baz: 5},
      {bar: 'b', baz: 6},
    ];
  });

  it('should add new item to empty array', () => {
    array = [];
    expect(appendOrUpdate(predicate)(array, {bar: 'c', baz: 7}))
      .toEqual([{bar: 'c', baz: 7}]);
  });

  it('should add new item if predicate doesn\'t match', () => {
    expect(appendOrUpdate(predicate)(array, {bar: 'c', baz: 7}))
      .toEqual([
        ...array,
        {bar: 'c', baz: 7},
      ]);
  });

  it('should update item if predicate matches', () => {
    expect(appendOrUpdate(predicate)(array, {bar: 'a', baz: 7}))
      .toEqual([
        {bar: 'a', baz: 7},
        {bar: 'b', baz: 6},
      ]);
  });
});

describe('appendOrUpdatePrimitive', () => {
  let array: string[];

  beforeEach(() => {
    array = ['foo', 'bar'];
  });

  it('should add new item', () => {
    expect(appendOrUpdateStringList(array, 'baz'))
      .toEqual(['foo', 'bar', 'baz']);
  });

  it('should not update if array already contains item', () => {
    expect(appendOrUpdateStringList(array, 'foo'))
      .toEqual(['foo', 'bar']);
  });
});

describe('objectFilter', () => {
  let object;
  const truePredicate = (key, value) => true;
  const falsePredicate = (key, value) => false;

  beforeEach(() => {
    object = {foo: 0, bar: 3, baz: 6, foobar: 7};
  });

  it('should work with empty object', () => {
    expect(objectFilter(truePredicate)({})).toEqual({});
  });

  it('should return a copy for always true predicate', () => {
    expect(objectFilter(truePredicate)(object)).toEqual(object);
  });

  it('should return an empty object for always false predicate', () => {
    expect(objectFilter(falsePredicate)(object)).toEqual({});
  });

  it('should return odd values', () => {
    expect(objectFilter((key, value) => value % 2 === 0)(object))
      .toEqual({foo: 0, baz: 6});
  });

  it('should filter out zero values', () => {
    expect(objectFilter((key, value) => value > 0)(object))
      .toEqual({bar: 3, baz: 6, foobar: 7});
  });
});

describe('firstIfContains', () => {
  it('should return the original array when there\'s no hit', () => {
    expect(firstIfContains(['foo', 'bar', 'baz'], 'john'))
      .toEqual(['foo', 'bar', 'baz']);
  });

  it('should move item to the first position', () => {
    expect(firstIfContains(['foo', 'bar', 'baz'], 'baz'))
      .toEqual(['baz', 'foo', 'bar']);
  });
});

describe('unique', () => {
  it('should return a uique array', () => {
    expect(unique([1, 1, 2, 2, 3, 4, 5, 6, 2]))
      .toEqual([1, 2, 3, 4, 5, 6]);
  });
});
