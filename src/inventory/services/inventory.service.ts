import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRegisterImport } from '../interfaces';
import { SkuService } from '../../catalog/services/sku.service';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly skuService: SkuService,
  ) {}

  public async register(newImport: IRegisterImport) {
    const inventories: Inventory[] = [];
    await Promise.all(
      newImport.items.map(async (item) => {
        for (let index = 0; index < item.count; index++) {
          const inventory = new Inventory();
          inventory.skuId = item.sku;
          inventory.warehouseId = newImport.warehouseId;
          inventories.push(inventory);
        }
        await this.skuService.updateQuantity(item.sku, item.count);
      }),
    );
    return this.inventoryRepository.save(inventories);
  }
}
