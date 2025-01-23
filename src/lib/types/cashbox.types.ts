import {
  CargoType,
  WeekType,
} from "@/app/(backend-logic)/workflow/_feature/types";
import { GeneralTableType } from "./general.types";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";

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
    trip_number: TripType["trip_number"];
    trip_status: TripType["status"];
    week_type: WeekType["table_type"];
    week_number: WeekType["week_number"];
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
