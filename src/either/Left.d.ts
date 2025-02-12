interface Left<L> {
  readonly kind: 'left';
  readonly leftValue: L;
}
