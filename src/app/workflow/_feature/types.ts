export type CargoType = {
  id: number;
  trip_id: number;
  created_at: Date;
  receipt_address: string;
  unloading_city: string;
  weight: string;
  volume: string;
  quantity: string;
  driver: string;
  amount: string;
  is_unpalletizing: boolean;
  comments: string;
  client_name: string;
  client_bin: string;
  cargo_name: string;
  payer: string;
  transportation_manager: string;
  is_documents: boolean;
  status: string;
  arrival_date: string;
  sgm_manager: string;
  payment: string;
  loading_scheme: string;
  user_id: string;
};

export type WeekType = {
  id: number;
  created_at: Date;
  user_id: string;
};
