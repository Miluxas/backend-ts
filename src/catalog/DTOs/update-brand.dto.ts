import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class UpdateBrandBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  title: string;
}
