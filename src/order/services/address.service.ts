import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListQuery } from '../../common/list-query.type';
import { PaginatedList } from '../../common/paginated-list.type';
import { PaginationService } from '../../pagination/pagination.service';
import { Address } from '../entities/address.entity';
import { ICreateAddress } from '../interfaces';
import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';
import { City } from '../entities/city.entity';
import { Area } from '../entities/area.entity';
import { AddressError } from '../errors';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    private readonly paginationService: PaginationService,
  ) {}

  async getAll(query: ListQuery, rbContent?: any): Promise<PaginatedList<any>> {
    return this.paginationService.findAndPaginate<Address>(
      this.addressRepository,
      query,
      rbContent ? { filterQuery: rbContent } : {},
    );
  }

  public async create(
    newAddress: ICreateAddress,
    rbContent?: any,
  ): Promise<Address> {
    const address = new Address();
    Object.assign(address, rbContent);
    Object.assign(address, newAddress);
    const city = await this.cityRepository.findOneBy({ id: address.cityId });
    address.cityName = city.name;
    address.countryId = city.countryId;
    address.countryName = city.countryName;
    address.stateId = city.stateId;
    address.stateName = city.stateName;
    const area=await this.areaRepository.query(`SELECT * FROM area
    WHERE ST_CONTAINS( ST_GEOMFROMTEXT(
      concat(
        'POLYGON((',
        polygon,
        '))')
      ), POINT(${address.latitude}, ${address.longitude}))`)
      if(!area[0]|| area[0].cityId!=address.cityId){
        throw new Error(AddressError.AREA_NOT_FOUND);
      }
      address.areaId=area[0].id
    return this.addressRepository.save(address);
  }

  public async update(
    id: number,
    newAddress: ICreateAddress,
    rbContent?: any,
  ): Promise<Address> {
    const filter = rbContent ?? {};
    Object.assign(filter, { id });
    const address = await this.addressRepository.findOneBy(filter);
    Object.assign(address, newAddress);
    if (newAddress.cityId) {
      const city = await this.cityRepository.findOneBy({ id: address.cityId });
      address.cityName = city.name;
      address.countryId = city.countryId;
      address.countryName = city.countryName;
      address.stateId = city.stateId;
      address.stateName = city.stateName;
    }
    return this.addressRepository.save(address);
  }

  public async setDefault(id: number, rbContent?: any): Promise<boolean> {
    const filter = rbContent ?? {};
    await this.addressRepository.update(filter, { isDefault: false });
    Object.assign(filter, { id });
    await this.addressRepository.update(filter, { isDefault: true });
    return true;
  }
  
  public async delete(id: number, rbContent?: any): Promise<boolean> {
    const filter = rbContent ?? {};
    Object.assign(filter, { id });
    await this.addressRepository.softRemove(filter);
    return true;
  }
}
