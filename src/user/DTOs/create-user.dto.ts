import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateUserBodyDto {
  @ApiProperty({ example: 'firstName' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'lastName' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'email' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'password' })
  @IsOptional()
  @IsString()
  avatarImageId?: string;
}
