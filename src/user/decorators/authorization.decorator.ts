import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const Authorization = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse(),
    UseGuards(JwtAuthGuard),
  );
};
