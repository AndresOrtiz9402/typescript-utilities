interface UnitOfWor<T, L, R> {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  work(input: T): Promise<R>;
  runWork(input: T): Promise<L, R>;
}
