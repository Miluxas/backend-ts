import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class UpdateWarehouseBodyDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  name: string;
}
