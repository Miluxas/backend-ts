import { ApiProperty } from '@nestjs/swagger';

export class GetWarehouseDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
