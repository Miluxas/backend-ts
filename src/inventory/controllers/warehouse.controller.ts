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
  CreateWarehouseBodyDto,
  GetWarehouseDetailResponseDto,
  GetWarehouseListResponseDto,
  SetDeliveryCostBodyDto,
  SetDeliveryCostResponseDto,
  UpdateWarehouseBodyDto,
} from '../DTOs';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { WarehouseError } from '../errors/warehouse.error';
import { WarehouseService } from '../services/warehouse.service';
import { IdParamDto } from '../../common/id-param.dto';
import { ListQueryDto } from '../../common/list-query.dto';
import { Authorization } from '../../common/authorization.decorator';

@ApiTags('Warehouse')
@Controller('warehouses')
@Authorization()
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly errorHandlerService: ErrorHandlerService<WarehouseError>,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ListStandardResponseFactory(GetWarehouseListResponseDto),
  })
  getList(@Query() query: ListQueryDto) {
    return this.warehouseService.getAll(query).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get('/:id')
  @ApiOkResponse({
    type: StandardResponseFactory(GetWarehouseDetailResponseDto),
  })
  getDetail(@Param() param: IdParamDto) {
    return this.warehouseService.getById(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post()
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetWarehouseDetailResponseDto),
  })
  async create(@Body() body: CreateWarehouseBodyDto) {
    return this.warehouseService.create(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put('/:id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetWarehouseDetailResponseDto),
  })
  async update(
    @Param() param: IdParamDto,
    @Body() body: UpdateWarehouseBodyDto,
  ) {
    return this.warehouseService.update(param.id, body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete('/:id')
  @ApiCreatedResponse({
    type: StandardResponseFactory(Boolean),
  })
  async delete(@Param() params: IdParamDto) {
    return this.warehouseService.delete(params.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Post('/:id/delivery-cost')
  @ApiCreatedResponse({
    type: StandardResponseFactory(SetDeliveryCostResponseDto),
  })
  async setDeliveryCost(
    @Param() params: IdParamDto,
    @Body() body: SetDeliveryCostBodyDto,
  ) {
    return this.warehouseService
      .setDeliveryCost(params.id, body)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }
}
