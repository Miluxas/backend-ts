import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { IVariableValue } from '../interfaces/variable-value.interface';

export class UpdateVariableTypeBodyDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: [{ name: 'name', value: 'value' }],
  })
  @IsOptional()
  @IsArray()
  values?: IVariableValue[];
}
