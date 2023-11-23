import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordBodyDto {
  @ApiProperty({ example: 'newPassword' })
  @IsString()
  newPassword: string;

  @ApiProperty({ example: 'oldPassword' })
  @IsString()
  oldPassword: string;
}
