import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class ParcelInfoBodyDto {
  @ApiProperty({
    example: [
      {
        sku: 'skuId',
        count: 3,
      },
    ],
  })
  @IsArray()
  items: ParcelInfoItem[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  areaId: number;
}

export class ParcelInfoItem {
  @ApiProperty({ example: 'skuId' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  count: number;
}

export class ParcelInfoResponseDto {
}
