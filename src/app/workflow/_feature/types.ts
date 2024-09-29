import { AllCitiesType, PriceType, QuantityType } from "@/lib/references";

export type CargoType = {
  id: number;
  trip_id: number;
  created_at: Date;
  receipt_address: string;

  unloading_point: {
    city: AllCitiesType;
    withDelivery: boolean;
    deliveryAddress: string;
  };
  weight: string;
  volume: string;
  quantity: {
    value: string;
    type: QuantityType;
  };

  driver: {
    id: string;
    value: string;
  };
  amount: {
    value: string;
    type: PriceType;
  };

  is_unpalletizing: boolean;
  comments: string;

  client_bin: string;
  cargo_name: string;
  transportation_manager: string;
  is_documents: boolean;
  status: {
    factDate?: string;
    estimatedDate: string;
  };
  loading_scheme: string;
  user_id: string;
};

export type WeekType = {
  id: number;
  created_at: Date;
  user_id: string;
};
