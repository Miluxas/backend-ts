import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    ListStandardResponseFactory,
    StandardResponseFactory,
} from '../../interceptors/formatter/standard-response.factory';
import {
    CreateUserBodyDto,
    GetUserDetailResponseDto,
    GetUserListResponseDto,
    UpdateUserBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { UserError } from '../errors/user.error';
import { UserService } from '../services/user.service';
import { IdParamDto } from '../../common/id-param.dto';
import { Authorization } from '../decorators/authorization.decorator';

@ApiTags('User')
@Controller('users')
@Authorization()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly errorHandlerService: ErrorHandlerService<UserError>,
  ) {}
  
  @Get(':id')
  @ApiOkResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  getById(@Param() param: IdParamDto) {
    return this.userService.getById(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  async create(@Body() body: CreateUserBodyDto) {
    return this.userService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetUserDetailResponseDto),
  })
  async update(
    @Param() param: IdParamDto,
    @Body() body: UpdateUserBodyDto,
  ) {
    return this.userService.update(param.id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
