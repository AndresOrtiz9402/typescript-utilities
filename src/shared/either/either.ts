class Left<L> {
  constructor(readonly value?: L | null | undefined) {}
  readonly kind = 'left';
  readonly leftValue: L;
}

class Right<R> {
  constructor(private readonly value?: R | null | undefined) {}
  readonly kind = 'right';
  readonly rightValue: R;
}

class Either<L, R> {
  constructor(private readonly either: Left<L> | Right<R>) {
    if (!(this.either instanceof Left) && !(this.either instanceof Right))
      throw Error(
        `Either must be an instance of Left or Right.\n
         Use the static makeLeft or makeRight methods of class Either.`
      );
  }

  readonly fold = <O, U>(leftFn: (left: L) => O, rightFn: (right: R) => U): O | U => {
    return this.either.kind === 'left'
      ? leftFn(this.either.leftValue)
      : rightFn(this.either.rightValue);
  };

  readonly getKind = () => this.either.kind;

  readonly getOrElse = (defaultValue: R): R => {
    return this.fold(
      () => defaultValue,
      someValue => someValue
    );
  };

  readonly getOrThrow = (errorMessage?: string): R => {
    const throwFn = () => {
      throw Error(errorMessage ?? 'An error has occurred: ' + this.either.kind);
    };

    return this.fold(
      () => throwFn(),
      rightValue => rightValue
    );
  };

  readonly getValue = () =>
    this.either.kind === 'left' ? this.either.leftValue : this.either.rightValue;

  readonly isLeft = (): boolean => {
    return this.either.kind === 'left';
  };
  readonly isRight = (): boolean => {
    return this.either.kind === 'right';
  };

  static makeLeft<L>(value?: L): Left<L> {
    return new Left(value);
  }

  static makeRight<R>(value?: R): Right<R> {
    return new Right(value);
  }
}
