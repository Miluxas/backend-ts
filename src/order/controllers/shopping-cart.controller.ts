import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../common/authorization.decorator';
import { AuthorizedRequest } from '../../common/authorized-request.type';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import {
  GetShoppingCartResponseDto,
  UpdateShoppingCartSkuBodyDto,
} from '../DTOs';
import { OrderError } from '../errors';
import { ShoppingCartService } from '../services/shopping-cart.service';

@ApiTags('Shopping cart')
@Controller('shopping-cart')
@Authorization()
export class ShoppingCartController {
  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly errorHandlerService: ErrorHandlerService<OrderError>,
  ) {}

  @Get('')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetShoppingCartResponseDto),
  })
  async get(
    @Req() req: AuthorizedRequest,
  ): Promise<GetShoppingCartResponseDto | void> {
    return this.shoppingCartService.getByUserId(req.user.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put('')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetShoppingCartResponseDto),
  })
  async update(
    @Req() req: AuthorizedRequest,
    @Body() body: UpdateShoppingCartSkuBodyDto,
  ): Promise<GetShoppingCartResponseDto | void> {
    return this.shoppingCartService
      .updateSku(req.user.id, body.sku, body.count)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }

}
