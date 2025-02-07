type BaseEntity<Entity, Id> = Entity & { id: Id };

type Input<Entity, OmitBase, Id> = {
  [P in Exclude<keyof Entity, OmitBase>]: BaseEntity<Entity, Id>[P];
};

type BaseResponse<Entity, Id> = BaseEntity<Entity, Id> | { status: 'fail'; error: unknown };

export type BaseRepository<Entity, OmitBase, Id> = {
  create(input: Input<Entity, OmitBase, Id>): Promise<BaseResponse<Entity, Id>>;

  deletedById(input: Id): Promise<{ status: 'success' } | { status: 'fail'; error: unknown }>;

  getAll(): Promise<BaseEntity<Entity, Id>[] | { status: 'fail'; error: unknown }>;

  getById(input: Id): Promise<BaseResponse<Entity, Id>>;

  updateById(
    id: Id,
    updateInput: Partial<Input<Entity, OmitBase, Id>>
  ): Promise<{ status: 'success'; data: unknown } | { status: 'fail'; error: unknown }>;
};
