import { Injectable } from '@nestjs/common';
import { Between, FindOperator, In, Like, Repository } from 'typeorm';
import { FindAndPaginateOptions } from './types/find-and-paginate-options';
import { ListQuery } from '../common/list-query.type';
import { PaginatedList } from '../common/paginated-list.type';
import { Aggregate } from 'mongoose';

@Injectable()
export class PaginationService {
  async findAndPaginate<Entity>(
    repository: Repository<Entity>,
    listQuery: ListQuery,
    options: Partial<FindAndPaginateOptions<Entity>>,
  ):Promise<PaginatedList<any>> {
    const completeOptions = new FindAndPaginateOptions<Entity>();
    Object.assign(completeOptions, options);

    const take = listQuery.take ?? 10;
    const skip = listQuery.skip ?? 0;
    let queryObject;
   
    if (
      completeOptions.textSearchFields.length > 0 &&
      listQuery.search &&
      listQuery.search.length > 0
    ) {
      const fullTextSearch = completeOptions.textSearchFields.join(',');
      const isFullTextSearchable = repository.metadata.indices.find(
        (index) =>
          index.isFulltext == true &&
          index.columns.map((col) => col.propertyName).join(',') ==
            fullTextSearch,
      );
      if (isFullTextSearchable) {
        console.log('Full Text Search');
        queryObject = {
          id: new FindOperator('raw', fullTextSearch, true, true, () => {
            return ` MATCH(${fullTextSearch}) AGAINST ('${listQuery.search}*' IN BOOLEAN MODE) `;
          }),
          ...completeOptions.filterQuery,
        };
      } else {
        queryObject = completeOptions.textSearchFields.map((field) => ({
          ...this.formatSearchString(field, listQuery.search),
          ...completeOptions.filterQuery,
        }));
      }
    } else {
      queryObject = completeOptions.filterQuery;
    }
    const result = await repository.findAndCount({
      where: queryObject,
      relations: completeOptions.relations,
      take: take,
      skip: skip,
      withDeleted: completeOptions.withDeleted,
      loadEagerRelations: completeOptions.loadEagerRelations,
      cache: completeOptions.cache,
    });
    const number = result[1];
    const pureItems = result[0];
    const totalPages = Math.floor(number / take) + (number % take > 0 ? 1 : 0);
    const currentPage = Math.floor(skip / take) + 1;
    const itemCount = currentPage < totalPages ? take : number % take;
    const items = [];
    await Promise.all(
      pureItems.map(async (element, index) => {
        items[index] = await completeOptions.convertor(element);
      }),
    );
    return {
      items,
      pagination: {
        itemCount,
        totalItems: number,
        itemsPerPage: take,
        totalPages,
        currentPage,
        search: listQuery.search,
      },
    };
  }

  public async addPaginateToAggregate <T>(
    aggregate: Aggregate<any[]>,
    listQuery: ListQuery,
    options: Partial<FindAndPaginateOptions<T>>,
  ): Promise<PaginatedList<any>> {

    const completeOptions = new FindAndPaginateOptions<T>();
    Object.assign(completeOptions, options);
    const take = listQuery.take ?? 20;
    const skip = listQuery.skip ?? 1;
  
    aggregate.facet({
      count: [{ $count: 'totalCount' }],
      items: [{ $skip: skip }, { $limit: take }],
    });
  
    const result = await aggregate;

    const number =result[0]?.count[0]?.totalCount ?? 0;
    const pureItems = result[0].items;
    const totalPages = Math.floor(number / take) + (number % take > 0 ? 1 : 0);
    const currentPage = Math.floor(skip / take) + 1;
    const itemCount = currentPage < totalPages ? take : number % take;
    const items = [];
    await Promise.all(
      pureItems.map(async (element, index) => {
        items[index] = await completeOptions.convertor(element);
      }),
    );
    return {
      items,
      pagination: {
        itemCount,
        totalItems: number,
        itemsPerPage: take,
        totalPages,
        currentPage,
        search: listQuery.search,
      },
    };
  };
  paginateList<Entity>(list: Entity[]) {
    return {
      items: list,
      pagination: {
        itemCount: list.length,
        totalItems: list.length,
        itemsPerPage: list.length,
        totalPages: 1,
        currentPage: 1,
        sort: {},
        filters: {},
        search: '',
      },
    };
  }

  public stdFilterForTypeOrm(filter: any) {
    const result = {};
    Object.keys(filter).forEach((key) => {
      if (Array.isArray(filter[key])) {
        if (key.endsWith('.#period')) {
          Object.assign(result, {
            [key.replace('.#period', '')]: Between(
              filter[key][0],
              filter[key][1],
            ),
          });
        } else {
          Object.assign(result, { [key]: In(filter[key]) });
        }
      } else if (
        Object.keys(filter[key]).length > 0 &&
        typeof filter[key] !== 'string'
      ) {
        Object.assign(result, { [key]: this.stdFilterForTypeOrm(filter[key]) });
      } else {
        Object.assign(result, { [key]: filter[key] });
      }
    });
    return result;
  }

  formatSearchString(field: string, searchStr: string, language?: string) {
    const strArray = field.split('.');
    if (strArray.length < 2) {
      if (field.startsWith('ml_')) {
        if (language) {
          return { [field]: Like(`"${language}": "%${searchStr}%`) };
        }
        return { [field]: Like(`%: "${searchStr}%`) };
      }
      return { [field]: Like(`${searchStr}%`) };
    }
    return {
      [strArray[0]]: this.formatSearchString(
        field.substring(strArray[0].length + 1),
        searchStr,
        language,
      ),
    };
  }

  search(
    filterQuery: any,
    search: string,
    textSearchFields: string[],
  ) {
    let queryObject: {};

    if (textSearchFields.length > 0 && search && search.length > 0) {
      queryObject = textSearchFields.map((field) => ({
        ...this.formatSearchString(field, search),
        ...filterQuery,
      }));

      return queryObject;
    }
    return filterQuery;
  }

}
