import { ApiProperty } from '@nestjs/swagger';

export class GetOrderDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
