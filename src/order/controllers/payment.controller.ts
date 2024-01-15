import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import {
  GetOrderDetailResponseDto,
  GetOrderListResponseDto,
  ParcelInfoBodyDto,
  ParcelInfoResponseDto,
  PaymentRedirectQueryDto,
  RegisterOrderBodyDto,
  RegisterOrderResponseDto
} from '../DTOs';
import { OrderError } from '../errors';
import { OrderService } from '../services/order.service';
import { IdParamDto } from '../../common/id-param.dto';
import { Authorization } from '../../common/authorization.decorator';
import { ListQueryDto } from '../../common/list-query.dto';
import { AuthorizedRequest } from '../../common/authorized-request.type';
import { PaymentService } from '../services/payment.service';
import { Public } from '../../common/public.decorator';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly errorHandlerService: ErrorHandlerService<OrderError>,
  ) {}

  @Public()
  @Get('/order-payment-link/:id')
  @ApiOkResponse({
    type: StandardResponseFactory(GetOrderDetailResponseDto),
  })
  getPayment(@Param() param: IdParamDto) {
    return this.paymentService.getPaymentLink(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Public()
  @Get('/return')
  @ApiOkResponse({
    type: StandardResponseFactory(PaymentRedirectQueryDto),
  })
  paymentRedirect(@Query() query: PaymentRedirectQueryDto) {
    return this.paymentService.updateOrderStatus(query.token).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
