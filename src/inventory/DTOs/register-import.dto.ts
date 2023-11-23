import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class RegisterImportBodyDto {
  @ApiProperty({
    example: [
      {
        sku: 'skuId',
        count: 3,
      },
    ],
  })
  @IsArray()
  items: InventoryItem[];

  @ApiProperty({ example: 10 })
  @IsNumber()
  warehouseId: number;
}

export class InventoryItem {
  @ApiProperty({ example: 'skuId' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  count: number;
}

export class RegisterImportResponseDto {
}
