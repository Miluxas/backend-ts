import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentRedirectQueryDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'title' })
  @IsString()
  PayerID: string;
}