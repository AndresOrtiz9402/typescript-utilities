import { TRANSACTION } from './transaction';

test('transaction enum', () => {
  const actual = TRANSACTION.COMMITTED;

  expect(actual).toBe('Transaction committed.');
});
