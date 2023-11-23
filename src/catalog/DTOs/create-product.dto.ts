import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductBodyDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'brandId' })
  @IsString()
  brandId: string;

  @ApiProperty({ example: ['categoryId'] })
  @IsOptional()
  @IsArray()
  categoriesIds: string[];

  @ApiProperty({ example: ['imageId'] })
  @IsOptional()
  @IsArray()
  imagesIds: string[];

  @ApiProperty({ example: [{ name: 'name', value: 'value' }] })
  @IsOptional()
  @IsArray()
  attributes?: { name: string; value: string }[];

  @ApiProperty({
    example: [
      {
        title: 'title',
        typeId: 'typeId',
        values: [{ name: 'name', value: 'value' }],
      },
    ],
  })
  @IsArray()
  skus: ProductSku[];
}

export class ProductSku {
  @ApiProperty({ example: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ example: ['imageId'] })
  @IsOptional()
  @IsArray()
  imagesIds: string[];

  @ApiProperty({ example: 10 })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: [
      {
        title: 'title',
        typeId: 'typeId',
        values: { name: 'name', value: 'value' },
      },
    ],
  })
  @IsArray()
  variants: {
    title: string;
    typeId: string;
    value: ProductSkuVariableValue;
  }[];
}

export class ProductSkuVariableValue {
  @ApiProperty({ example: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'value' })
  @IsString()
  value: string;
}
