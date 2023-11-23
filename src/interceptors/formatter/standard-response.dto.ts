import { ApiProperty } from '@nestjs/swagger';

export abstract class StandardResponseDto<T> {
  @ApiProperty({
    default: 'ok',
    type: String,
    required: true,
    example: 'ok',
  })
  readonly message: string;

  abstract payload: T;
}
