import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { InventoryController } from './controllers/inventory.controller';
import { WarehouseController } from './controllers/warehouse.controller';
import { DeliveryCost } from './entities/delivery-cost.entity';
import { Inventory } from './entities/inventory.entity';
import { Parcel } from './entities/parcel.entity';
import { Warehouse } from './entities/warehouse.entity';
import { inventoryErrorMessages, warehouseErrorMessages } from './errors';
import { InventoryService } from './services/inventory.service';
import { ParcelService } from './services/parcel.service';
import { WarehouseService } from './services/warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Warehouse, DeliveryCost, Parcel]),
    ErrorHandlerModule.register({
      ...inventoryErrorMessages,
      ...warehouseErrorMessages,
    }),
    CatalogModule,
  ],
  controllers: [InventoryController, WarehouseController],
  providers: [InventoryService, WarehouseService, ParcelService],
  exports: [ParcelService],
})
export class InventoryModule {}
