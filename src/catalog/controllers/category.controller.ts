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
    CreateCategoryBodyDto,
    GetCategoryDetailResponseDto,
    GetCategoryListResponseDto,
    UpdateCategoryBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { CategoryError } from '../errors/category.error';
import { CategoryService } from '../services/category.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly errorHandlerService: ErrorHandlerService<CategoryError>,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetCategoryListResponseDto),
  })
  getList() {
    return this.categoryService.getAll().catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get(':_id')
  @ApiOkResponse({
    type: StandardResponseFactory(GetCategoryDetailResponseDto),
  })
  getDetail(@Param() param: ObjectIdParamDto) {
    return this.categoryService.getById(param._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetCategoryDetailResponseDto),
  })
  async create(@Body() body: CreateCategoryBodyDto) {
    return this.categoryService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':_id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetCategoryDetailResponseDto),
  })
  async update(
    @Param() param: ObjectIdParamDto,
    @Body() body: UpdateCategoryBodyDto,
  ) {
    return this.categoryService.update(param._id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete(':_id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Param() params: ObjectIdParamDto) {
    return this.categoryService.delete(params._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
