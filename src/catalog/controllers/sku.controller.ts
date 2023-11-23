import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import {
  StandardResponseFactory
} from '../../interceptors/formatter/standard-response.factory';
import {
  SkuResponseDto
} from '../DTOs';
import { ProductError } from '../errors/product.error';
import { ProductService } from '../services/product.service';
import { SkuService } from '../services/sku.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';

@ApiTags('Sku')
@Controller('skus')
export class SkuController {
  constructor(
    private readonly skuService: SkuService,
    private readonly errorHandlerService: ErrorHandlerService<ProductError>,
  ) {}

  @Get(':_id')
  @ApiOkResponse({
    type: StandardResponseFactory(SkuResponseDto),
  })
  getDetail(@Param() param: ObjectIdParamDto) {
    return this.skuService.getById(param._id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
