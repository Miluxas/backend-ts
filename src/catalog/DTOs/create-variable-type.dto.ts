import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { IVariableValue } from '../interfaces/variable-value.interface';

export class CreateVariableTypeBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: [{ name: 'name', value: 'value' }],
  })
  @IsArray()
  values: IVariableValue[];
}
