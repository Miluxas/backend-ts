import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, now } from 'mongoose';
import { MediaService } from '../../media/services/media.service';
import { ProductError } from '../errors/product.error';
import { INewProduct, ISku, IUpdatedProduct } from '../interfaces';
import { Brand, BrandDocument } from '../models/brand.model';
import { Category, CategoryDocument } from '../models/category.model';
import { Product, ProductDocument, Sku } from '../models/product.model';
import {
  VariableType,
  VariableTypeDocument,
} from '../models/variable-type.model';

@Injectable()
export class SkuService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(VariableType.name)
    private readonly variableTypeModel: Model<VariableTypeDocument>,
    private readonly mediaService: MediaService,
  ) {}

  public async getById(_id: string): Promise<Sku> {
    const foundProduct = await this.productModel
      .findOne({ 'skus._id': _id })
      .exec();
    if (!foundProduct) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    return foundProduct.skus.filter(
      (sku) => sku._id == new Types.ObjectId(_id),
    )[0];
  }

  public async updateQuantity(_id: string,different:number) {
    const foundProduct = await this.productModel
      .findOneAndUpdate({ 'skus._id': _id },{
        $inc:{'skus.$.quantity':different}
      })
      .exec();
  }
}
