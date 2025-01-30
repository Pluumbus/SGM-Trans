import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { GeneralTableType } from "./general.types";
import { TripDTOType } from "./trip.types";
import { WeekDTOType } from "./week.types";

export type CashboxDTOType = {
  client: {
    full_name: {
      first_name: string;
      middle_name?: string;
      last_name?: string;
    };
    company_name: string;
    phone_number: string;
    comment?: string;
  };
  amount_to_pay: number;
  current_balance: number;
  cargos: Array<{
    id: CargoType["id"];
    trip_number: TripDTOType["trip_number"];
    trip_status: TripDTOType["status"];
    paid_amount: CargoType["paid_amount"];
    week_type: WeekDTOType["table_type"];
    week_number: WeekDTOType["week_number"];
    amount: CargoType["amount"];
  }>;
  payment_terms: number;
  operations: Array<{
    date: string;
    amount: number;
    user_id: string;
    cargo_id: CargoType["id"];
  }>;
};
export type CashboxTableType = CashboxDTOType & GeneralTableType;
