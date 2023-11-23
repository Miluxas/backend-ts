export interface IOrderInfo {
  orderId?: number;
  areaId: number;
  items: { sku: string; count: number }[];
}
