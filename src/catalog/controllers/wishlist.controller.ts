import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
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
  UpdateReviewBodyDto,
  WishlistBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { ProductError } from '../errors/product.error';
import { ProductService } from '../services/product.service';
import { ObjectIdParamDto } from '../../common/object-id-param.dto';
import { ListQueryDto } from '../../common/list-query.dto';
import { Authorization } from '../../common/authorization.decorator';
import { Public } from '../../common/public.decorator';
import { AuthorizedRequest } from '../../common/authorized-request.type';
import { WishlistService } from '../services/wishlist.service';

@ApiTags('Wishlist')
@Authorization()
@Controller('wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly errorHandlerService: ErrorHandlerService<ProductError>,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetProductListResponseDto),
  })
  getList(@Query() query: ListQueryDto, @Req() req: AuthorizedRequest) {
    return this.wishlistService.getAll(req.user.id, query).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetProductDetailResponseDto),
  })
  async add(
    @Body() body: WishlistBodyDto, @Req() req: AuthorizedRequest
  ) {
    return this.wishlistService.add(req.user.id, body.productId).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete()
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(
    @Body() body: WishlistBodyDto, @Req() req: AuthorizedRequest
  ) {
    return this.wishlistService.remove(req.user.id, body.productId).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
