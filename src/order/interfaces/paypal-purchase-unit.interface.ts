export interface IPaypalPurchaseUnit {
  reference_id: string;
  amount: { currency_code: string; value: string };
}
