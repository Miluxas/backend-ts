import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import { ChangePasswordBodyDto, GetUserDetailResponseDto, LoginBodyDto } from '../DTOs';
import { AuthError } from '../errors';
import { AuthService } from '../services/auth.service';
import { AuthorizedRequestType } from '../types/authorized-request.type';
import { Public } from '../../common/public.decorator';
import { Authorization } from '../../common/authorization.decorator';

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
}
