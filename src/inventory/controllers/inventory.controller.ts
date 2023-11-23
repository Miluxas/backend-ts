import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerService } from '../../error-handler/error-handler.service';
import { StandardResponseFactory } from '../../interceptors/formatter/standard-response.factory';
import {
  RegisterImportBodyDto,
  RegisterImportResponseDto
} from '../DTOs';
import { InventoryError } from '../errors';
import { InventoryService } from '../services/inventory.service';

@ApiTags('Inventory')
@Controller('inventories')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly errorHandlerService: ErrorHandlerService<InventoryError>,
  ) {}

  @Post('/register-import')
  @ApiCreatedResponse({
    type: StandardResponseFactory(RegisterImportResponseDto),
  })
  async register(@Body() body: RegisterImportBodyDto) {
    return this.inventoryService.register(body).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
