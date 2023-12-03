import { ApiProperty } from '@nestjs/swagger';
import { IMedia } from '../../common/media.interface';

export class GetShoppingCartResponseDto {
  @ApiProperty()
  items: ShoppingCartItemResponseDto[];
}



export class ShoppingCartItemResponseDto {
  @ApiProperty()
  skuId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  images: IMedia[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  count: number;
}