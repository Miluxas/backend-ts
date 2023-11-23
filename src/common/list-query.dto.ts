import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListQueryDto {
  @ApiProperty({ required: false, example: 0 })
  @IsNumberString()
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsNumberString()
  @IsOptional()
  take?: number;

  @ApiProperty({ required: false, example: '' })
  @IsString()
  @IsOptional()
  search?: string;
}
