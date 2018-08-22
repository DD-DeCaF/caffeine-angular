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
