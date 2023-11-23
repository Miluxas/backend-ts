import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { InventoryModule } from '../inventory/inventory.module';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { orderErrorMessages, parcelErrorMessages } from './errors';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ErrorHandlerModule.register({
      ...orderErrorMessages,
      ...parcelErrorMessages,
    }),
    CatalogModule,
    InventoryModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
