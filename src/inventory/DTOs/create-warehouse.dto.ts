import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class CreateWarehouseBodyDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  name: string;
}
