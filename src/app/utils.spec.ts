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

import { appendOrUpdate, appendOrUpdateStringList } from './utils';

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
