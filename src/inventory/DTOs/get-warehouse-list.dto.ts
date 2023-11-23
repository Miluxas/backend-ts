import { ApiProperty } from '@nestjs/swagger';

export class GetWarehouseListResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
