import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class WishlistBodyDto {
  @ApiProperty({ example: 'productId' })
  @IsString()
  productId: string;
}
