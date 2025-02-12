export class Maybe<T> {
  constructor(private readonly value?: T | null | undefined) {
    this.kind = value ? 'some' : 'none';
  }

  private readonly kind: 'none' | 'some';

  readonly getKind = () => {
    return this.kind;
  };

  readonly getValue = () => {
    return this.kind === 'none' ? null : this.value;
  };
}
