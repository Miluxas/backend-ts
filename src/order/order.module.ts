import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { InventoryModule } from '../inventory/inventory.module';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { orderErrorMessages, parcelErrorMessages } from './errors';
import { OrderService } from './services/order.service';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ShoppingCartController } from './controllers/shopping-cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order,ShoppingCart]),
    ErrorHandlerModule.register({
      ...orderErrorMessages,
      ...parcelErrorMessages,
    }),
    CatalogModule,
    InventoryModule,
  ],
  controllers: [OrderController,ShoppingCartController],
  providers: [OrderService,ShoppingCartService],
})
export class OrderModule {}
