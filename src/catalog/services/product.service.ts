import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, now } from 'mongoose';
import { ListQuery } from '../../common/list-query.type';
import { PaginatedList } from '../../common/paginated-list.type';
import { MediaService } from '../../media/services/media.service';
import { PaginationService } from '../../pagination/pagination.service';
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
export class ProductService {
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
    private readonly paginationService: PaginationService,
  ) {}

  public async getAll(query: ListQuery): Promise<PaginatedList<any>> {
    return this.paginationService.addPaginateToAggregate<Product>(
      this.productModel.aggregate(),
      query,
      { textSearchFields: ['name', 'description'] },
    );
  }

  public async getById(_id: string): Promise<Product> {
    const foundProduct = await this.productModel
      .findById(new Types.ObjectId(_id))
      .lean()
      .exec();
    if (!foundProduct) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    return foundProduct;
  }

  public async create(newProduct: INewProduct): Promise<Product> {
    const { brandId, categoriesIds, imagesIds, skus, ...productObject } =
      newProduct;
    Object.assign(productObject, {
      brand: await this.brandModel.findById(brandId).exec(),
    });

    Object.assign(productObject, {
      categories: await Promise.all(
        categoriesIds.map(
          async (id) => await this.categoryModel.findById(id).exec(),
        ),
      ),
    });

    Object.assign(productObject, {
      images: await Promise.all(
        imagesIds.map(async (id) => await this.mediaService.getMedia(id)),
      ),
    });

    Object.assign(productObject, {
      skus: await Promise.all(
        skus.map(async (sku) => await this.createNewSku(sku)),
      ),
    });

    const document = await this.productModel.create(productObject);
    const savedProduct = await document.save();
    return savedProduct.toJSON<Product>();
  }

  public async update(_id: string, updatedProduct: IUpdatedProduct) {
    const foundProduct = await this.productModel.findById(_id).exec();
    if (!foundProduct) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    const { brandId, categoriesIds, imagesIds, skus, ...productObject } =
      updatedProduct;

    Object.assign(foundProduct, productObject);

    if (brandId)
      Object.assign(foundProduct, {
        brand: await this.brandModel.findById(brandId).exec(),
      });

    if (categoriesIds)
      Object.assign(foundProduct, {
        categories: await Promise.all(
          categoriesIds.map(
            async (id) => await this.categoryModel.findById(id).exec(),
          ),
        ),
      });

    if (imagesIds)
      Object.assign(foundProduct, {
        images: await Promise.all(
          imagesIds.map(async (id) => await this.mediaService.getMedia(id)),
        ),
      });

    if (skus) {
      let updatedSkus = skus;
      let skuList = [];

      await Promise.all(
        foundProduct.skus.map(async (oldSku, index) => {
          const existSku = updatedSkus.find(
            (sku) => oldSku._id.toHexString() == sku._id,
          );
          if (existSku) {
            updatedSkus = updatedSkus.filter((sku) => sku._id !== existSku._id);
            oldSku.name = existSku.name;
            oldSku.price = existSku.price;
            oldSku.variants = await Promise.all(
              existSku.variants.map(async (variant) => ({
                title: variant.title,
                value: variant.value,
                type: await this.variableTypeModel
                  .findById(variant.typeId)
                  .exec(),
              })),
            );
          }
          skuList[index] = oldSku;
        }),
      );
      await Promise.all(
        updatedSkus.map(async (newSku) => {
          const createdSku: Sku = await this.createNewSku(newSku);
          skuList.push(createdSku);
        }),
      );
      foundProduct.skus = skuList;
      foundProduct.markModified('skus');
    }
    return foundProduct.save();
  }

  private async createNewSku(newSku: ISku): Promise<Sku> {
    return {
      _id: new Types.ObjectId(),
      name: newSku.name,
      price: newSku.price,
      quantity: 0,
      variants: await Promise.all(
        newSku.variants.map(async (variant) => ({
          title: variant.title,
          value: variant.value,
          type: await this.variableTypeModel.findById(variant.typeId).exec(),
        })),
      ),
      images: await Promise.all(
        newSku.imagesIds.map(
          async (id) => await this.mediaService.getMedia(id),
        ),
      ),
      createdAt: now(),
      updatedAt: now(),
    };
  }

  public async delete(_id: string): Promise<boolean> {
    await this.productModel.findByIdAndDelete(new Types.ObjectId(_id)).exec();
    return true;
  }
}
