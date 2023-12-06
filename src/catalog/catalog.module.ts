import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { MediaModule } from '../media/media.module';
import { BrandController } from './controllers/brand.controller';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { SkuController } from './controllers/sku.controller';
import { VariableTypeController } from './controllers/variable-type.controller';
import { WishlistController } from './controllers/wishlist.controller';
import {
  BrandErrorMessages,
  CategoryErrorMessages,
  VariableTypeErrorMessages,
} from './errors';
import { Brand, BrandSchema } from './models/brand.model';
import { Category, CategorySchema } from './models/category.model';
import { Product, ProductSchema } from './models/product.model';
import { VariableType, VariableTypeSchema } from './models/variable-type.model';
import { BrandService } from './services/brand.service';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { SkuService } from './services/sku.service';
import { VariableTypeService } from './services/variable-type.service';
import { WishlistService } from './services/wishlist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Brand.name,
        schema: BrandSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: VariableType.name,
        schema: VariableTypeSchema,
      },
    ]),
    ErrorHandlerModule.register({
      ...CategoryErrorMessages,
      ...BrandErrorMessages,
      ...VariableTypeErrorMessages,
    }),
    MediaModule,
  ],
  controllers: [
    CategoryController,
    BrandController,
    ProductController,
    VariableTypeController,
    SkuController,
    WishlistController,
  ],
  providers: [
    CategoryService,
    BrandService,
    ProductService,
    VariableTypeService,
    SkuService,
    WishlistService,
  ],
  exports: [SkuService],
})
export class CatalogModule {}
