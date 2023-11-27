import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    ListStandardResponseFactory,
    StandardResponseFactory,
} from '../../interceptors/formatter/standard-response.factory';
import {
    CreateProductBodyDto,
    GetProductDetailResponseDto,
    GetProductListResponseDto,
    UpdateProductBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { ProductError } from '../errors/product.error';
import { ProductService } from '../services/product.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';
import { ListQueryDto } from '../../common/list-query.dto';
import { Authorization } from '../../common/authorization.decorator';
import { Public } from '../../common/public.decorator';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly errorHandlerService: ErrorHandlerService<ProductError>,
  ) {}

  @Get()
  @Public()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetProductListResponseDto),
  })
  getList(@Query() query:ListQueryDto) {
    return this.productService.getAll(query).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get(':_id')
  @Public()
  @ApiOkResponse({
    type: StandardResponseFactory(GetProductDetailResponseDto),
  })
  getDetail(@Param() param: ObjectIdParamDto) {
    return this.productService.getById(param._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetProductDetailResponseDto),
  })
  async create(@Body() body: CreateProductBodyDto) {
    return this.productService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':_id')
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetProductDetailResponseDto),
  })
  async update(
    @Param() param: ObjectIdParamDto,
    @Body() body: UpdateProductBodyDto,
  ) {
    return this.productService.update(param._id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete(':_id')
  @Authorization()
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Param() params: ObjectIdParamDto) {
    return this.productService.delete(params._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
