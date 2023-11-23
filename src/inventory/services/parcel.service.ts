import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { SkuService } from '../../catalog/services/sku.service';
import { ParcelError } from '../../order/errors';
import { Inventory } from '../entities/inventory.entity';
import { Parcel } from '../entities/parcel.entity';
import { IOrderInfo } from '../interfaces';

@Injectable()
export class ParcelService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Parcel)
    private readonly parcelRepository: Repository<Parcel>,
    private readonly skuService: SkuService,
  ) {}

  public async info(
    newImport: IOrderInfo,
  ): Promise<{ cost: number; parcels: any[] }> {
    const warehouseIds = new Set<number>();
    const inventories: {
      id: number;
      skuId: string;
      warehouseId: number;
      cost: number;
    }[] = [];
    for (const item of newImport.items.sort((a, b) => b.count - a.count)) {
      const addedWarehousesIds = [...warehouseIds];
      const itemInventories = await this.inventoryRepository.query(`
      SELECT inventory.id,inventory.skuId,inventory.warehouseId,delivery_cost.cost, if(inventory.warehouseId in (${
        addedWarehousesIds.length > 0 ? addedWarehousesIds.join(',') : '0'
      }),true,false) as pri FROM inventory
      inner join delivery_cost on inventory.warehouseId= delivery_cost.warehouseId 
      where inventory.status='Available' and inventory.skuId='${item.sku}' and
      areaId=${
        newImport.areaId
      } order by pri desc, delivery_cost.cost asc limit ${item.count}
     `);
      if (itemInventories.length < item.count)
        throw new Error(ParcelError.NOT_POSSIBLE);

      inventories.push(...itemInventories);
      for (const itemInv of itemInventories) {
        warehouseIds.add(itemInv.warehouseId);
      }
    }
    const parcels = inventories.reduce((group, inventory) => {
      let groupItem = group.find(
        (item) => item.warehouseId == inventory.warehouseId,
      );
      if (!groupItem) {
        groupItem = {
          warehouseId: inventory.warehouseId,
          count: 0,
          cost: inventory.cost,
        };
        group.push(groupItem);
      }
      groupItem.count++;
      return group;
    }, []);
    const cost = parcels.reduce((sum, parcel) => {
      sum = sum + 1 * parcel.cost;
      return sum;
    }, 0);
    return {
      cost,
      parcels,
    };
  }

  public async register(
    newImport: IOrderInfo,
  ): Promise<{ cost: number; parcels: any[] }> {
    const warehouseIds = new Set<number>();
    const inventories: {
      id: number;
      skuId: string;
      warehouseId: number;
      cost: number;
    }[] = [];
    for (const item of newImport.items.sort((a, b) => b.count - a.count)) {
      const addedWarehousesIds = [...warehouseIds];
      const itemInventories = await this.inventoryRepository.query(`
      SELECT inventory.id,inventory.skuId,inventory.warehouseId,delivery_cost.cost, if(inventory.warehouseId in (${
        addedWarehousesIds.length > 0 ? addedWarehousesIds.join(',') : '0'
      }),true,false) as pri FROM inventory
      inner join delivery_cost on inventory.warehouseId= delivery_cost.warehouseId 
      where inventory.status='Available' and inventory.skuId='${item.sku}' and
      areaId=${
        newImport.areaId
      } order by pri desc, delivery_cost.cost asc limit ${item.count}
     `);
      inventories.push(...itemInventories);
      for (const itemInv of itemInventories) {
        warehouseIds.add(itemInv.warehouseId);
      }
    }
    await this.inventoryRepository.update(
      { id: In(inventories.map((inventory) => inventory.id)) },
      { status: 'Reserved' },
    );

    const parcels = inventories.reduce((group, inventory) => {
      let groupItem = group.find(
        (item) => item.warehouseId == inventory.warehouseId,
      );
      if (!groupItem) {
        groupItem = {
          warehouseId: inventory.warehouseId,
          count: 0,
          cost: inventory.cost,
          items: [],
          inventoriesIds: [],
        };
        group.push(groupItem);
      }
      groupItem.inventoriesIds.push(inventory.id);
      const parcelItem = groupItem.items.find(
        (item) => (item.sku = inventory.skuId),
      );
      if (!parcelItem) {
        groupItem.items.push({ sku: inventory.skuId, count: 1 });
      } else parcelItem.count++;
      groupItem.count++;
      return group;
    }, []);
    for (const parcel of parcels) {
      const newParcel = new Parcel();
      newParcel.warehouseId = parcel.warehouseId;
      newParcel.items = parcel.items;
      newParcel.orderId = newImport.orderId;
      await this.parcelRepository.save(newParcel);

      await this.inventoryRepository.update(
        { id: In(parcel.inventoriesIds) },
        { parcelId: newParcel.id },
      );
    }
    const cost = parcels.reduce((sum, parcel) => {
      sum = sum + 1 * parcel.cost;
      return sum;
    }, 0);
    return {
      cost,
      parcels,
    };
  }

  public async checkoutOrder(orderId: number) {
    return this.parcelRepository
      .findBy({ orderId })
      .then(
        async (parcels) =>
          await this.inventoryRepository.update(
            { parcelId: In(parcels.map((parcel) => parcel.id)) },
            { status: 'Sold' },
          ),
      );
  }
}
