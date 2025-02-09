enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  AlreadyExist = 409,
  InternalServerError = 500,
  UnknownError = 520,
}

enum ErrorMessage {
  BadRequest = 'Bad Request',
  Unauthorized = 'Unauthorized',
  NotFound = 'Not Found',
  AlreadyExist = 'Already exist',
  InternalServerError = 'Internal Server Error',
  UnknownError = 'Unknown Error',
}

export class MappedErrors {
  [key: string | number]: ErrorCode;
}

const caseIn = {
  [ErrorCode.BadRequest]: ErrorMessage.BadRequest,
  [ErrorCode.Unauthorized]: ErrorMessage.Unauthorized,
  [ErrorCode.NotFound]: ErrorMessage.NotFound,
  [ErrorCode.AlreadyExist]: ErrorMessage.AlreadyExist,
  [ErrorCode.InternalServerError]: ErrorMessage.InternalServerError,
  [ErrorCode.UnknownError]: ErrorMessage.UnknownError,
};

export class ErrorMapper {
  constructor(private readonly map: MappedErrors) {}

  readonly getCode = (errorKey: string | number): ErrorCode => {
    return this.map[errorKey] ?? ErrorCode.UnknownError;
  };

  readonly getError = (
    errorKey: string | number
  ): { statusCode: ErrorCode; errorMessage: ErrorMessage } => {
    const statusCode = this.getCode(errorKey);
    return { statusCode, errorMessage: caseIn[statusCode] };
  };
}
