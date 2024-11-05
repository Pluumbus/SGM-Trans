import { AllCitiesType, PriceType, QuantityType } from "@/lib/references";

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
  transportation_manager: string;
  is_documents: boolean;
  status: string;
  loading_scheme: string;
  user_id: string;
  is_act_ready: {
    value: boolean;
    user_id: string;
  };
  paid_amount: number;
  request_id?: number;
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
};
