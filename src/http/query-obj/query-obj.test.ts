import { QueryObj } from './query-obj';

test('Query Obj', () => {
  const value = undefined;
  const actual = QueryObj.makeQuery({
    ds: 'a',
    ts: value ?? 2,
  });

  expect(actual).toBe('?ds=a&ts=2');
});
