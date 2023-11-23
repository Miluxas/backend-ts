import { ApiProperty } from '@nestjs/swagger';

export class GetProductListResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
