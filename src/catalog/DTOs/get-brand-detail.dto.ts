import { ApiProperty } from '@nestjs/swagger';

export class GetBrandDetailResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
