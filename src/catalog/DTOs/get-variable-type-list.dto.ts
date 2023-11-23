import { ApiProperty } from '@nestjs/swagger';

export class GetVariableTypeListResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
