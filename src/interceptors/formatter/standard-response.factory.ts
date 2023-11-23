import { ApiProperty } from '@nestjs/swagger';

function changeClassName(classInst, name?: string) {
  const value = `Response-Model-${name}`;
  Object.defineProperty(classInst, 'name', {
    value,
  });
}

function generatePayload(payloadDto: any): { Payload: any; name: string } {
  let Payload;
  let name: string;
  try {
    // checks if `payloadDto` is object or is a class and can be instantiated
    new payloadDto();
    Payload = payloadDto;
    name = payloadDto.name;
  } catch (err) {
    class Initial {}
    const keys = Object.keys(payloadDto);
    Payload = PipeInheritance(payloadDto, keys, Initial);
  }
  return { Payload, name };
}

// Problem: We want a class which has all the properties of `payloadDto` and those properties should be decorated by `ApiProperty`
// sln: recursively call `PipeInheritance` with `payloadDto`, `keys` (which are the object keys of `payloadDto`) and `PrevClass`
// (which initially is an empty class)
// at each iteration, `PipeInheritance` creates a class with one property: first key in `keys` array. then decorates
// this property with `ApiProperty`. this class inherits from `PrevClass` so it contains all of the previous keys.
// after that, `keys.shift()` is called and that key is removed from the list
// this goes on until there is no key left inside `keys`
function PipeInheritance(payloadDto, keys: string[], PrevClass) {
  if (keys.length) {
    const PayloadType = payloadDto[keys[0]];

    class Payload extends PrevClass {
      @ApiProperty({
        type: PayloadType,
      })
      // @ts-ignore
      readonly [keys[0]];
    }

    keys.shift();
    return PipeInheritance(payloadDto, keys, Payload);
  }

  return PrevClass;
}

export function StandardResponseFactory(payloadDto: any): any {
  const { Payload, name } = generatePayload(payloadDto);

  class StandardResponse {
    @ApiProperty({
      type: Payload,
    })
    readonly payload;
  }
  changeClassName(StandardResponse, name);
  return StandardResponse;
}

export function ListStandardResponseFactory(payloadDto: any): any {
  const { Payload, name } = generatePayload(payloadDto);

  class ArrayResponse {
    @ApiProperty({
      type: Payload,
      isArray: true,
    })
    readonly payload;
  }
  changeClassName(ArrayResponse, name);
  return ArrayResponse;
}

export function PaginatedListStandardResponseFactory(payloadDto: any): any {
  const { Payload, name } = generatePayload(payloadDto);

  class PaginatedDto {
    @ApiProperty({ type: Number })
    itemCount: number;

    @ApiProperty({ type: Number })
    totalItems: number;

    @ApiProperty({ type: Number })
    itemsPerPage: number;

    @ApiProperty({ type: Number })
    totalPages: number;

    @ApiProperty({ type: Number })
    currentPage: number;

    @ApiProperty()
    sort: any;

    @ApiProperty()
    filters: any;

    @ApiProperty()
    searchQuery: string;
  }

  class PaginatedListResponse {
    @ApiProperty({
      type: Payload,
      isArray: true,
    })
    readonly items;

    @ApiProperty({
      type: PaginatedDto,
    })
    readonly paginate;
  }

  class PaginatedArrayResponse {
    @ApiProperty({
      type: PaginatedListResponse,
    })
    readonly payload;
  }
  changeClassName(PaginatedListResponse, name + '_list');
  changeClassName(PaginatedArrayResponse, name);
  return PaginatedArrayResponse;
}
