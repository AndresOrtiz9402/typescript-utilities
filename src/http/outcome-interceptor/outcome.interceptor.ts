interface Response {
  end(): void;
  json(body: any): void;
  status(code: number): Response;
}

enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

enum ErrorMessage {
  BadRequest = 'Bad Request',
  Unauthorized = 'Unauthorized',
  NotFound = 'Not Found',
  AlreadyExist = 'Already exist',
  InternalServerError = 'Internal Server Error',
  UnknownError = 'Unknown Error',
}

class MappedErrors {
  [key: string | number]: ErrorCode;
}

export const caseIn = {
  [ErrorCode.BAD_REQUEST]: ErrorMessage.BadRequest,
  [ErrorCode.UNAUTHORIZED]: ErrorMessage.Unauthorized,
  [ErrorCode.NOT_FOUND]: ErrorMessage.NotFound,
  [ErrorCode.CONFLICT]: ErrorMessage.AlreadyExist,
  [ErrorCode.INTERNAL_SERVER_ERROR]: ErrorMessage.InternalServerError,
};

type MappedError = { status: ErrorCode; errorMessage: string };

export class ErrorMapper {
  constructor(private readonly map: MappedErrors) {}

  readonly getCode = (errorKey: string | number): ErrorCode => {
    return this.map[errorKey] ?? ErrorCode.INTERNAL_SERVER_ERROR;
  };

  readonly getError = (errorKey: string | number): MappedError => {
    const status = this.getCode(errorKey);
    return { status, errorMessage: caseIn[status] };
  };
}

type InitialResult<L, R> = SuccessOrError<L, R>;

type LeftHandler = <L>(error: L) => string | number;

type RightHandler = <T, R>(data: T) => R;

const { ERROR, SUCCESS } = STATUS;

const makeFail = <L>(error: L, handler?: LeftHandler): string | number =>
  handler ? handler(error as L) : (error as string | number);

const makeSuccess = <T, R>(data: T, handler?: RightHandler): T | R =>
  handler ? handler(data) : data;

class MappedMessages {
  [key: string | number]: string;
}

export class OutcomeInterceptor {
  constructor(
    private readonly mapOfHttpCodes: MappedErrors,
    private readonly mapOfResponseMessages: MappedMessages
  ) {}

  readonly getHttpCode = (errorKey: string | number): number => {
    return this.mapOfHttpCodes[errorKey] ?? 500;
  };

  readonly getError = (errorKey: string | number): MappedError => {
    const status = this.getHttpCode(errorKey);
    return { status, errorMessage: this.mapOfResponseMessages[status] };
  };

  readonly getResultOrError = <L, R>(input: {
    result: InitialResult<L, R>;
    ErrorCodeIfSuccess: number;
    httpResponseServices: Response;
    options?: {
      inputHandler?: (value: InitialResult<L, R>) => InitialResult<L, R>;
      leftHandler?: LeftHandler;
      rightHandler?: RightHandler;
    };
  }) => {
    const { result, ErrorCodeIfSuccess, httpResponseServices, options } = input;

    const initialResult = options?.inputHandler?.(result) ?? result;

    const { status } = initialResult;

    const adaptedResult =
      status === ERROR
        ? {
            status,
            error: makeFail(initialResult.error, options?.leftHandler),
          }
        : {
            status,
            data: makeSuccess(initialResult.data, options?.rightHandler),
          };

    if (adaptedResult.status === SUCCESS)
      return httpResponseServices.status(ErrorCodeIfSuccess).json(adaptedResult);

    if (adaptedResult.status === ERROR) {
      const { status, errorMessage } = this.getError(adaptedResult.error);
      return httpResponseServices.status(status).json(errorMessage);
    }

    return httpResponseServices.status(500).json('Unknown error.');
  };
}
