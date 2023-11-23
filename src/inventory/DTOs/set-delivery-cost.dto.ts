import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';


export class SetDeliveryCostBodyDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  areaId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  cost: number;
}


export class SetDeliveryCostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  areaId: number;

  @ApiProperty()
  cost: number;
}
