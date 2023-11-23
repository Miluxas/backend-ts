import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryListResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
