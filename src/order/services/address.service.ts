import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListQuery } from '../../common/list-query.type';
import { PaginatedList } from '../../common/paginated-list.type';
import { PaginationService } from '../../pagination/pagination.service';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly paginationService: PaginationService,
  ) {}

  async getAll(query: ListQuery, rbContent?: any): Promise<PaginatedList<any>> {
    return this.paginationService.findAndPaginate<Address>(
      this.addressRepository,
      query,
      rbContent ? { filterQuery: rbContent } : {},
    );
  }
}
