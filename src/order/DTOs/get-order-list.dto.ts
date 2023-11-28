import { ApiProperty } from '@nestjs/swagger';

export class GetOrderListResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
