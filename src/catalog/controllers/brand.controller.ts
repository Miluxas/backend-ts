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
    CreateBrandBodyDto,
    GetBrandDetailResponseDto,
    GetBrandListResponseDto,
    UpdateBrandBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { BrandError } from '../errors/brand.error';
import { BrandService } from '../services/brand.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';

@ApiTags('Brand')
@Controller('brands')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly errorHandlerService: ErrorHandlerService<BrandError>,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetBrandListResponseDto),
  })
  getList() {
    return this.brandService.getAll().catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get(':_id')
  @ApiOkResponse({
    type: StandardResponseFactory(GetBrandDetailResponseDto),
  })
  getDetail(@Param() param: ObjectIdParamDto) {
    return this.brandService.getById(param._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetBrandDetailResponseDto),
  })
  async create(@Body() body: CreateBrandBodyDto) {
    return this.brandService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':_id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetBrandDetailResponseDto),
  })
  async update(
    @Param() param: ObjectIdParamDto,
    @Body() body: UpdateBrandBodyDto,
  ) {
    return this.brandService.update(param._id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete(':_id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Param() params: ObjectIdParamDto) {
    return this.brandService.delete(params._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
