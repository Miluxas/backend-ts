import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../common/authorization.decorator';
import { IdParamDto } from '../../common/id-param.dto';
import { Public } from '../../common/public.decorator';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import {
  StandardResponseFactory
} from '../../interceptors/formatter/standard-response.factory';
import {
  CreateUserBodyDto,
  GetUserDetailResponseDto,
  UpdateUserBodyDto
} from '../DTOs';
import { UserError } from '../errors/user.error';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly errorHandlerService: ErrorHandlerService<UserError>,
  ) {}

  @Get(':id')
  @Authorization()
  @ApiOkResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  getById(@Param() param: IdParamDto) {
    return this.userService.getById(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @Public()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  async create(@Body() body: CreateUserBodyDto) {
    return this.userService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':id')
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  async update(@Param() param: IdParamDto, @Body() body: UpdateUserBodyDto) {
    return this.userService.update(param.id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
