import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand, BrandDocument } from '../models/brand.model';
import { Product, ProductDocument } from '../models/product.model';
import { BrandError } from '../errors/brand.error';
import { INewBrand, IUpdatedBrand } from '../interfaces';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getAll(): Promise<Brand[]> {
    return this.brandModel.find({}, { createdAt: 0, updatedAt: 0 }).lean();
  }

  public async getById(_id: string): Promise<Brand> {
    const foundBrand = await this.brandModel
      .findById(new Types.ObjectId(_id))
      .lean()
      .exec();
    if (!foundBrand) {
      throw new Error(BrandError.BRAND_NOT_FOUND);
    }
    return foundBrand;
  }

  public async create(newBrand: INewBrand): Promise<Brand> {
    const document = await this.brandModel.create(newBrand);
    const savedBrand = await document.save();
    return savedBrand.toJSON<Brand>();
  }

  public async update(_id: string, updatedBrand: IUpdatedBrand) {
    return this.brandModel
      .findByIdAndUpdate(
        _id,
        {
          $set: updatedBrand,
        },
        { new: true },
      )
      .then((brand) => {
        this.productModel
          .updateMany({ 'brand._id': brand._id }, { $set: { brand } })
          .exec();
        return brand;
      });
  }

  public async delete(_id: string): Promise<boolean> {
    await this.brandModel.findByIdAndDelete(new Types.ObjectId(_id)).exec();
    return true;
  }
}
