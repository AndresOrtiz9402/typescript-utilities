type MappedError = { status: number; errorMessage: string };

type FailResult<L> = { status: 'fail'; error: L };

type SuccessResult<R> = { status: 'success'; data: R };

type InitialResult<L, R> = FailResult<L> | SuccessResult<R>;

type LeftHandler = <L>(error: L) => string | number;

type RightHandler = <T, R>(data: T) => R;

interface Response {
  end(): void;
  json(body: any): void;
  status(code: number): Response;
}

interface MappedErrors {
  [key: string | number]: number;
}

interface MappedMessages {
  [key: string | number]: string;
}

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

export const mapOfResponseMessages = {
  [ErrorCode.BadRequest]: ErrorMessage.BadRequest,
  [ErrorCode.Unauthorized]: ErrorMessage.Unauthorized,
  [ErrorCode.NotFound]: ErrorMessage.NotFound,
  [ErrorCode.AlreadyExist]: ErrorMessage.AlreadyExist,
  [ErrorCode.InternalServerError]: ErrorMessage.InternalServerError,
  [ErrorCode.UnknownError]: ErrorMessage.UnknownError,
};

const makeFail = <L>(error: L, handler?: LeftHandler): string | number =>
  handler?.(error as L) ?? (error as string | number);

const makeSuccess = <T, R>(data: T, handler?: RightHandler): T | R => handler?.(data) ?? data;

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
    httpStatusIfSuccess: number;
    httpResponseServices: Response;
    options?: {
      inputHandler?: (value: InitialResult<L, R>) => InitialResult<L, R>;
      leftHandler?: LeftHandler;
      rightHandler?: RightHandler;
    };
  }) => {
    const { result, httpStatusIfSuccess, httpResponseServices, options } = input;

    const initialResult = options?.inputHandler?.(result) ?? result;

    const { status } = initialResult;

    const adaptedResult =
      status === 'fail'
        ? {
            status,
            error: makeFail(initialResult.error, options?.leftHandler),
          }
        : {
            status,
            data: makeSuccess(initialResult.data, options?.rightHandler),
          };

    if (adaptedResult.status === 'success')
      return httpResponseServices.status(httpStatusIfSuccess).json(adaptedResult);

    if (adaptedResult.status === 'fail') {
      const { status, errorMessage } = this.getError(adaptedResult.error);
      return httpResponseServices.status(status).json(errorMessage);
    }

    return httpResponseServices.status(500).end();
  };
}
