import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import { ChangePasswordBodyDto, GetUserDetailResponseDto, LoginBodyDto } from '../DTOs';
import { AuthError } from '../errors';
import { AuthService } from '../services/auth.service';
import { AuthorizedRequestType } from '../types/authorized-request.type';
import { Public } from '../../common/public.decorator';
import { Authorization } from '../../common/authorization.decorator';
import { RefreshTokenGuard } from '../guards/refresh-token.quard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly errorHandlerService: ErrorHandlerService<AuthError>,
  ) {}

  @Post('login')
  @Public()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body).catch((error) => {
      console.log(error)
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put('/change-password')
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(String),
  })
  async changePassword(
    @Req() req: AuthorizedRequestType,
    @Body() body: ChangePasswordBodyDto,
  ) {
    return this.authService
      .changePassword(req.user.id, body.oldPassword, body.newPassword)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Get('/refresh')
  @ApiBearerAuth()
  refreshTokens(@Req() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
