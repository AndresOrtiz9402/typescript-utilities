enum TRANSACTION {
  COMMITTED = 'Transaction committed.',
  ROLLED_BACK = 'Transaction rolled back.',
}

type Rollback<L> = { status: TRANSACTION.ROLLED_BACK; error: L };

type Committed<R> = { status: TRANSACTION.COMMITTED; data: R };

type CommitOrRollback<L, R> = Rollback<L> | Committed<R>;

interface BaseTransaction<T, L, R> {
  execute(input: T): Promise<CommitOrRollback<L, R>>;
}
