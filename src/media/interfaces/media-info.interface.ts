import { IMediaVariant } from './media-variant.interface';

export interface IMediaInfo {
  id: number;
  url: string;
  size: number;
  variants?: IMediaVariant[];
}
