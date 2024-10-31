import { CargoType } from "../_feature/types";

export type CashboxType = {
  id: number;
  client: string;
  amount_to_pay: string;
  current_balance: string;
  cargos: Array<CargoType>;
  payment_terms: string;
};
