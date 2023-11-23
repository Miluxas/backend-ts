import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CreateCategoryBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  title: string;
}
