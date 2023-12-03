import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateShoppingCartSkuBodyDto  {
  @ApiProperty({ example: 'skuId' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  count: number;
}

