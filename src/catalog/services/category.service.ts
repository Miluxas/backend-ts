import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../models/category.model';
import { Product, ProductDocument } from '../models/product.model';
import { CategoryError } from '../errors/category.error';
import { INewCategory, IUpdatedCategory } from '../interfaces';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getAll(): Promise<Category[]> {
    return this.categoryModel.find({}, { createdAt: 0, updatedAt: 0 }).lean();
  }

  public async getById(_id: string): Promise<Category> {
    const foundCategory = await this.categoryModel
      .findById(new Types.ObjectId(_id))
      .lean()
      .exec();
    if (!foundCategory) {
      throw new Error(CategoryError.CATEGORY_NOT_FOUND);
    }
    return foundCategory;
  }

  public async create(newCategory: INewCategory): Promise<Category> {
    const document = await this.categoryModel.create(newCategory);
    const savedCategory = await document.save();
    return savedCategory.toJSON<Category>();
  }

  public async update(_id: string, updatedCategory: IUpdatedCategory) {
    return this.categoryModel
      .findByIdAndUpdate(
        _id,
        {
          $set: updatedCategory,
        },
        { new: true },
      )
      .then(async (category) => {
        await this.productModel
          .updateMany(
            { categories: { $elemMatch: { _id: category._id } } },
            { $set: { 'categories.$': category } },
          )
          .exec();
        return category;
      });
  }

  public async delete(_id: string): Promise<boolean> {
    await this.categoryModel.findByIdAndDelete(new Types.ObjectId(_id)).exec();
    return true;
  }
}
