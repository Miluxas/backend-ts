import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AddressController } from './controllers/address.controller';
import { OrderController } from './controllers/order.controller';
import { ShoppingCartController } from './controllers/shopping-cart.controller';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { Order } from './entities/order.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { State } from './entities/state.entity';
import { orderErrorMessages, parcelErrorMessages } from './errors';
import { AddressService } from './services/address.service';
import { OrderService } from './services/order.service';
import { ShoppingCartService } from './services/shopping-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      ShoppingCart,
      Address,
      Country,
      State,
      City,
    ]),
    ErrorHandlerModule.register({
      ...orderErrorMessages,
      ...parcelErrorMessages,
    }),
    CatalogModule,
    InventoryModule,
  ],
  controllers: [OrderController, ShoppingCartController, AddressController],
  providers: [OrderService, ShoppingCartService, AddressService],
})
export class OrderModule {}
