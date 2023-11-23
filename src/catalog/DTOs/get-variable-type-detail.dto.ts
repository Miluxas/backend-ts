import { ApiProperty } from '@nestjs/swagger';

export class GetVariableTypeDetailResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;
}
