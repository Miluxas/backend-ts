import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ObjectIdParamDto {
  @ApiProperty()
  @IsString()
  _id: string;
}

