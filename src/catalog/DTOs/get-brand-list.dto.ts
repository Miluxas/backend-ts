import { ApiProperty } from '@nestjs/swagger';

export class GetBrandListResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
