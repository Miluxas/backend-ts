import { IVariableValue } from './variable-value.interface';

export interface ISku {
  _id?: string;
  name: string;
  price: number;
  imagesIds?: string[];
  variants: { title: string; typeId: string; value: IVariableValue }[];
}
