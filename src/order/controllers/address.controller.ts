import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../common/authorization.decorator';
import { AuthorizedRequest } from '../../common/authorized-request.type';
import { ListQueryDto } from '../../common/list-query.dto';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import {
  CreateAddressBodyDto,
  GetAddressDetailResponseDto,
  GetAddressListResponseDto,
  UpdateAddressBodyDto
} from '../DTOs';
import { AddressError } from '../errors';
import { AddressService } from '../services/address.service';
import { IdParamDto } from '../../common/id-param.dto';

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

  @Post()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetAddressDetailResponseDto),
  })
  async create(@Req() req: AuthorizedRequest,@Body() body: CreateAddressBodyDto) {
    return this.addressService.create(body,req.rbContent).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetAddressDetailResponseDto),
  })
  async update(
    @Req() req: AuthorizedRequest,
    @Param() param: IdParamDto,
    @Body() body: UpdateAddressBodyDto,
  ) {
    return this.addressService.update(param.id, body,req.rbContent).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put(':id/default')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetAddressDetailResponseDto),
  })
  async setDefault(
    @Req() req: AuthorizedRequest,
    @Param() param: IdParamDto,
  ) {
    return this.addressService.setDefault(param.id,req.rbContent).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete(':id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Req() req: AuthorizedRequest,@Param() params: IdParamDto) {
    return this.addressService.delete(params.id,req.rbContent).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
