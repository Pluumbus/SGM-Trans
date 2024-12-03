import { AllCitiesType, PriceType, QuantityType } from "@/lib/references";
import { SupaDoc } from "../[slug]/week/[weekId]/trip/[id]/_features/WorkflowBucket/api/types";

export type CargoType = {
  id: number;
  trip_id: number;
  created_at: string;
  receipt_address: string;

  unloading_point: {
    city: string;
    withDelivery: boolean;
    deliveryAddress: string;
  };
  weight: string;
  volume: string;
  quantity: {
    value: string;
    type?: QuantityType | "";
  };

  driver: {
    id: string;
    value: string;
  };
  amount: {
    value: string;
    type?: PriceType;
  };

  is_unpalletizing: boolean;
  comments: string;

  client_bin: {
    tempText: string;
    snts: string[];
    xin: string;
  };
  cargo_name: string;
  transportation_manager: number;
  is_documents: boolean;
  status: string;
  loading_scheme: string;
  user_id: string;
  act_details: {
    is_ready: boolean;
    user_id: string;
    amount: number;
    date_of_act_printed: string;
  };
  paid_amount: number;
  request_id: number | null;
};

export type WeekType = {
  id: number;
  created_at: string;
  user_id: string;
  week_number: number;
  table_type: "kz" | "ru";
  week_dates: {
    end_date: string;
    start_date: string;
  };
  docs: { doc: SupaDoc[] };
};
