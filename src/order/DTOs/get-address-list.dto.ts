import { ApiProperty } from '@nestjs/swagger';

export class GetAddressListResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
