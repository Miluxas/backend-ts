import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewBodyDto {
  @ApiProperty({ example: 'new comment' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  rate: number;
}
