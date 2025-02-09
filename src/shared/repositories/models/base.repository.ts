type BaseEntity<Entity, Id> = Entity & { id: Id };

type Input<Entity, OmitBase> = {
  [P in Exclude<keyof Entity, OmitBase>]: Entity[P];
};

type SuccessfulResult<Entity, Id> = { status: 'success'; data: BaseEntity<Entity, Id> };

type StatusError = { statusCode: number; error: unknown };

type FailureResult = { status: 'fail'; error: StatusError };

type EitherResult<Entity, Id> = SuccessfulResult<Entity, Id> | FailureResult;

export type BaseRepository<Entity, OmitBase, Id> = {
  create(input: Omit<Input<Entity, OmitBase>, 'id'>): Promise<EitherResult<Entity, Id>>;

  deletedById(input: Id): Promise<{ status: 'success'; data: unknown } | FailureResult>;

  getAll(): Promise<{ status: 'success'; data: BaseEntity<Entity, Id>[] } | FailureResult>;

  getById(input: Id): Promise<EitherResult<Entity, Id>>;

  updateById(
    id: Id,
    updateInput: Partial<Input<Entity, OmitBase>>
  ): Promise<{ status: 'success'; data: unknown } | FailureResult>;
};
