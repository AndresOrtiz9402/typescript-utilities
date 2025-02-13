enum STATUS {
  ERROR = 'error',
  SUCCESS = 'success',
}

type Fail<L> = { status: STATUS.ERROR; error: L };

type Success<R> = { status: STATUS.SUCCESS; data: R };

type SuccessOrError<L, R> = Fail<L> | Success<R>;
