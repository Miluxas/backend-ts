import { Column, ColumnOptions } from 'typeorm';

export function CurrencyColumn(options?: ColumnOptions) {
  return Column({ type: 'decimal', precision: 18, scale: 3, ...options });
}