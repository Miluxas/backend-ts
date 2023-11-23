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
    CreateProductBodyDto,
    GetProductDetailResponseDto,
    GetProductListResponseDto,
    UpdateProductBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { ProductError } from '../errors/product.error';
import { ProductService } from '../services/product.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly errorHandlerService: ErrorHandlerService<ProductError>,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetProductListResponseDto),
  })
  getList() {
    return this.productService.getAll().catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get(':_id')
  @ApiOkResponse({
    type: StandardResponseFactory(GetProductDetailResponseDto),
  })
  getDetail(@Param() param: ObjectIdParamDto) {
    return this.productService.getById(param._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetProductDetailResponseDto),
  })
  async create(@Body() body: CreateProductBodyDto) {
    return this.productService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':_id')
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
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Param() params: ObjectIdParamDto) {
    return this.productService.delete(params._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
