import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Warehouse } from '../entities/warehouse.entity';
import { WarehouseError } from '../errors';
import {
  INewWarehouse,
  ISetDeliveryCost,
  IUpdatedWarehouse,
} from '../interfaces';
import { DeliveryCost } from '../entities/delivery-cost.entity';
import { IListBody } from '../../pagination/interfaces/listbody.interface';
import { ListQuery } from '../../common/list-query.type';
import { PaginationService } from '../../pagination/pagination.service';
import { PaginatedList } from '../../common/paginated-list.type';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(DeliveryCost)
    private readonly deliveryCostRepository: Repository<DeliveryCost>,
    private readonly paginationService: PaginationService
  ) {}

  async getAll(query:ListQuery): Promise<PaginatedList<any>> {
    return this.paginationService.findAndPaginate<Warehouse>(this.warehouseRepository,query,{textSearchFields:['name']})
  }

  public async getById(id: number): Promise<Warehouse> {
    const foundWarehouse = await this.warehouseRepository.findOneBy({ id });
    if (!foundWarehouse) {
      throw new Error(WarehouseError.WarehousE_NOT_FOUND);
    }
    return foundWarehouse;
  }

  public async create(newWarehouse: INewWarehouse): Promise<Warehouse> {
    const warehouse = new Warehouse();
    Object.assign(warehouse, newWarehouse);
    return this.warehouseRepository.save(warehouse);
  }

  public async update(
    id: number,
    newValue: IUpdatedWarehouse,
  ): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOneBy({
      id,
    });
    if (!warehouse) {
      throw new Error(WarehouseError.WarehousE_NOT_FOUND);
    }
    Object.assign(warehouse, newValue);
    await this.warehouseRepository.save(warehouse);

    return warehouse;
  }

  public async delete(id: number): Promise<boolean> {
    await this.warehouseRepository.softDelete({ id });
    return true;
  }

  public async setDeliveryCost(
    id: number,
    delivery: ISetDeliveryCost,
  ): Promise<DeliveryCost> {
    let deliveryCost = await this.deliveryCostRepository.findOneBy({
      warehouseId: id,
      areaId: delivery.areaId,
    });
    if (!deliveryCost) {
      deliveryCost = new DeliveryCost();
      deliveryCost.areaId = delivery.areaId;
      deliveryCost.warehouseId = id;
    }
    deliveryCost.cost = delivery.cost;
    return this.deliveryCostRepository.save(deliveryCost);
  }
}
