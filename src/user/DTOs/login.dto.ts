import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';


export class LoginBodyDto {

  @ApiProperty({ example: 'email' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;

}
