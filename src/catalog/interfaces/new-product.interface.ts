import { ISku } from "./sku.interface";

export interface INewProduct {
  name: string;
  description: string;
  brandId: string;
  categoriesIds?: string[];
  imagesIds?: string[];
  attributes?: { name: string; value: string }[];
  skus: ISku[];
}
