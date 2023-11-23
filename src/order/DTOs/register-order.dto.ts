import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class RegisterOrderBodyDto {
  @ApiProperty({
    example: [
      {
        sku: 'skuId',
        count: 3,
      },
    ],
  })
  @IsArray()
  items: OrderItem[];
}

export class OrderItem {
  @ApiProperty({ example: 'skuId' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  count: number;
}

export class RegisterOrderResponseDto {
}
