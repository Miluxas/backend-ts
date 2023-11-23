import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class IdParamDto {
  @ApiProperty()
  @IsNumberString()
  id: number;
}

