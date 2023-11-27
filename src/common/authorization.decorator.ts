import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const Authorization = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse(),
  );
};
