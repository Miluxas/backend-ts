import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CreateMediaBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  url: string;
}
