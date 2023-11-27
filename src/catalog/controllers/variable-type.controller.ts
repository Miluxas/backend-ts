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
    CreateVariableTypeBodyDto,
    GetVariableTypeDetailResponseDto,
    GetVariableTypeListResponseDto,
    UpdateVariableTypeBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { VariableTypeError } from '../errors/variable-type.error';
import { VariableTypeService } from '../services/variable-type.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';
import { Authorization } from '../../common/authorization.decorator';
import { Public } from '../../common/public.decorator';

@ApiTags('VariableType')
@Controller('variable-types')
export class VariableTypeController {
  constructor(
    private readonly brandService: VariableTypeService,
    private readonly errorHandlerService: ErrorHandlerService<VariableTypeError>,
  ) {}

  @Get()
  @Public()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetVariableTypeListResponseDto),
  })
  getList() {
    return this.brandService.getAll().catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get(':_id')
  @Public()
  @ApiOkResponse({
    type: StandardResponseFactory(GetVariableTypeDetailResponseDto),
  })
  getDetail(@Param() param: ObjectIdParamDto) {
    return this.brandService.getById(param._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetVariableTypeDetailResponseDto),
  })
  async create(@Body() body: CreateVariableTypeBodyDto) {
    return this.brandService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':_id')
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetVariableTypeDetailResponseDto),
  })
  async update(
    @Param() param: ObjectIdParamDto,
    @Body() body: UpdateVariableTypeBodyDto,
  ) {
    return this.brandService.update(param._id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete(':_id')
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Param() params: ObjectIdParamDto) {
    return this.brandService.delete(params._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
