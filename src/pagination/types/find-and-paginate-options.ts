export class FindAndPaginateOptions<Entity> {
  filterQuery: any = {};
  convertor = (item: Entity) => <any>item;
  textSearchFields: string[] = [];
  relations: string[] = [];
  withDeleted = false;
  loadEagerRelations = true;
  cache: number | boolean = false;
}
