import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';


export class UpdateUserBodyDto {
  @ApiProperty({ example: 'firstName' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'lastName' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'password' })
  @IsOptional()
  @IsString()
  avatarImageId?: string;
}
