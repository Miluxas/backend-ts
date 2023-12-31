import { ApiProperty } from '@nestjs/swagger';

export class GetAddressListResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

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
