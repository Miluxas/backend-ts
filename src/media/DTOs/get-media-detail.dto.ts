import { ApiProperty } from '@nestjs/swagger';

export class GetMediaDetailResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  size: number;
}
