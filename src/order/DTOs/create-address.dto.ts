import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAddressBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  cityId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  areaId: number;

  @ApiProperty({ example: 'title' })
  @IsString()
  detail: string;

  @ApiProperty({ example: 'title' })
  @IsString()
  postalCode: string;
}
