import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class UpdateCategoryBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  title: string;
}
