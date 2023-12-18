import { ApiProperty } from '@nestjs/swagger';

export class GetAddressDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  areaId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  stateId: number;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  cityName: string;

  @ApiProperty()
  stateName: string;

  @ApiProperty()
  countryName: string;

  @ApiProperty()
  detail: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  postalCode: string;

}
