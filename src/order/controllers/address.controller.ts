import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../common/authorization.decorator';
import { AuthorizedRequest } from '../../common/authorized-request.type';
import { ListQueryDto } from '../../common/list-query.dto';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import {
  GetAddressListResponseDto
} from '../DTOs';
import { AddressError } from '../errors';
import { AddressService } from '../services/address.service';

@ApiTags('Address')
@Controller('addresses')
@Authorization()
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly errorHandlerService: ErrorHandlerService<AddressError>,
  ) {}

  @Get('')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetAddressListResponseDto),
  })
  async list(@Req() req: AuthorizedRequest, @Query() query: ListQueryDto) {
    return this.addressService.getAll(query, req.rbContent).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
