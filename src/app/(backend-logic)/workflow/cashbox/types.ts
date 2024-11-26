import { CargoType } from "../_feature/types";

export type CashboxType = {
  id: number;
  client: {
    full_name: {
      first_name: string;
      middle_name?: string;
      last_name: string;
    };
    phone_number: string;
    company_name?: string;
    comment?: string;
  };
  operations: Array<{
    date: string;
    amount: number;
    user_id: string;
    cargo_id: number;
  }> | null;
  amount_to_pay: string;
  current_balance: string;
  cargos: Array<CargoType>;
  payment_terms: number;
};
