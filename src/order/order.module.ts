import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '../catalog/catalog.module';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AddressController } from './controllers/address.controller';
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { ShoppingCartController } from './controllers/shopping-cart.controller';
import { Address } from './entities/address.entity';
import { Area } from './entities/area.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { State } from './entities/state.entity';
import {
  addressErrorMessages,
  orderErrorMessages,
  parcelErrorMessages,
} from './errors';
import { AddressService } from './services/address.service';
import { OrderService } from './services/order.service';
import { PaymentService } from './services/payment.service';
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
      Area,
      Payment,
    ]),
    ErrorHandlerModule.register({
      ...orderErrorMessages,
      ...parcelErrorMessages,
      ...addressErrorMessages,
    }),
    CatalogModule,
    InventoryModule,
    HttpModule,
  ],
  controllers: [
    OrderController,
    ShoppingCartController,
    AddressController,
    PaymentController,
  ],
  providers: [
    OrderService,
    ShoppingCartService,
    AddressService,
    PaymentService,
  ],
})
export class OrderModule {}
