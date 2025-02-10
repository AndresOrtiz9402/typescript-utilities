import { OutcomeInterceptor, mapOfResponseMessages } from './outcome.interceptor';

const postgresqlMappedErrors = {
  23505: 409,
  '404': 404,
};

const { getError, getHttpCode } = new OutcomeInterceptor(
  postgresqlMappedErrors,
  mapOfResponseMessages
);

test('should 409', () => {
  const alreadyExist = getHttpCode(23505);

  expect(alreadyExist).toBe(409);
});

test('should getError Already exist', () => {
  const alreadyExist = getError('23505');

  expect(alreadyExist).toStrictEqual({ status: 409, errorMessage: 'Already exist' });
});
