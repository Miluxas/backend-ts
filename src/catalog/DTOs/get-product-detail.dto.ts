import { ApiProperty } from '@nestjs/swagger';
import { GetBrandDetailResponseDto } from './get-brand-detail.dto';
import { GetCategoryDetailResponseDto } from './get-category-detail.dto';
import { IMedia } from '../../common/media.interface';

export class GetProductDetailResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  brand: GetBrandDetailResponseDto;

  @ApiProperty()
  categories: GetCategoryDetailResponseDto[];

  @ApiProperty()
  images: IMedia[];

  attributes?: { name: string; value: string }[];

  @ApiProperty()
  skus: SkuResponseDto[];
}

export class SkuResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  images: IMedia[];

  @ApiProperty()
  variants: GenerateSkuVariant[];

  @ApiProperty()
  price: number;
}

class VariableValue {
  @ApiProperty()
  name: string;
  @ApiProperty()
  value: string;
}

class VariableType {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  values: VariableValue[];
}
class GenerateSkuVariant {
  @ApiProperty()
  title: string;

  @ApiProperty()
  type: VariableType;

  @ApiProperty()
  value: VariableValue;
}
