import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  cityId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  areaId: number;

  @ApiProperty({ example: 'title' })
  @IsString()
  @IsOptional()
  detail: string;

  @ApiProperty({ example: 'title' })
  @IsString()
  @IsOptional()
  postalCode: string;
}
