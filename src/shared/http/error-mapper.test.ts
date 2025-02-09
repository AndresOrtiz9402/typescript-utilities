import { ErrorMapper, MappedErrors } from './error-mapper';
const postgresqlMappedErrors = {
  23505: 409,
  '404': 404,
};

const postgresqlErrorMapper = new ErrorMapper(postgresqlMappedErrors);

test('should 409', () => {
  const alreadyExist = postgresqlErrorMapper.getCode(23505);

  expect(alreadyExist).toBe(409);
});

test('should getError Already exist', () => {
  const alreadyExist = postgresqlErrorMapper.getError('23505');

  expect(alreadyExist).toStrictEqual({ statusCode: 409, errorMessage: 'Already exist' });
});
