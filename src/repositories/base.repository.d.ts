type BaseEntity<Entity, Id> = Entity & { id: Id };

type Input<Entity, OmitBase> = {
  [P in Exclude<keyof Entity, OmitBase>]: Entity[P];
};

type BaseRepository<Entity, OmitBaseEntity, Id> = {
  create<L>(
    input: Input<Entity, OmitBaseEntity>
  ): Promise<SuccessOrError<L, BaseEntity<Entity, Id>>>;

  deletedById<L, R>(input: Id): Promise<SuccessOrError<L, R>>;

  getAll<L>(): Promise<SuccessOrError<L, BaseEntity<Entity, Id>[]>>;

  getById<L>(input: Id): SuccessOrError<L, BaseEntity<Entity, Id>>;

  updateById<L>(
    id: Id,
    updateInput: Partial<Input<Entity, OmitBaseEntity>>
  ): Promise<SuccessOrError<L, BaseEntity<Entity, Id>>>;
};
