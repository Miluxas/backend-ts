import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import {
  ParcelInfoBodyDto,
  ParcelInfoResponseDto,
  RegisterOrderBodyDto,
  RegisterOrderResponseDto
} from '../DTOs';
import { OrderError } from '../errors';
import { OrderService } from '../services/order.service';
import { IdParamDto } from '../../common/id-param.dto';
import { Authorization } from '../../common/authorization.decorator';

@ApiTags('Order')
@Controller('orders')
@Authorization()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly errorHandlerService: ErrorHandlerService<OrderError>,
  ) {}

  @Post('/register')
  @ApiCreatedResponse({
    type: StandardResponseFactory(RegisterOrderResponseDto),
  })
  async register(@Body() body: RegisterOrderBodyDto) {
    return this.orderService.register(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get('/:id/parcels')
  @ApiCreatedResponse({
    type: StandardResponseFactory(ParcelInfoResponseDto),
  })
  async getParcelsInfo(@Param() params: IdParamDto) {
    return this.orderService.getParcelsInfo(params.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post('/:id/parcels')
  @ApiCreatedResponse({
    type: StandardResponseFactory(ParcelInfoResponseDto),
  })
  async registerParcels(@Param() params: IdParamDto) {
    return this.orderService.registerParcels(params.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post('/:id/checkout')
  @ApiCreatedResponse({
    type: StandardResponseFactory(ParcelInfoResponseDto),
  })
  async checkoutOrder(@Param() params: IdParamDto) {
    return this.orderService.checkoutOrder(params.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
