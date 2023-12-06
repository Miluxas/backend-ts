import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListQuery } from '../../common/list-query.type';
import { PaginatedList } from '../../common/paginated-list.type';
import { PaginationService } from '../../pagination/pagination.service';
import { Product, ProductDocument } from '../models/product.model';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  public async getAll(
    userId: number,
    query: ListQuery,
  ): Promise<PaginatedList<any>> {
    return this.paginationService.addPaginateToAggregate<Product>(
      this.productModel.aggregate([{ $match: { wishedBy: userId } }]),
      query,
      { textSearchFields: ['name', 'description'] },
    );
  }

  public async add(userId: number, productId: string) {
    return this.productModel.findByIdAndUpdate(productId, {
      $push: { wishedBy: userId },
    });
  }

  public async remove(userId: number, productId: string) {
    return this.productModel.findByIdAndUpdate(productId, {
      $pull: { wishedBy: userId },
    });
  }
}
