import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CreateBrandBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  title: string;
}
