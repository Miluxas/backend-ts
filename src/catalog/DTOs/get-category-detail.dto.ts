import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryDetailResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
