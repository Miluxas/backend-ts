import { IMedia } from '../../common/media.interface';

export interface IShoppingCartDetail {
  items: {
      skuId: string;
      name: string;
      images: IMedia[];
      price: number;
    count: number;
  }[];
}
