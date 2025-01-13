export type ActType = {
  client_bin: string;
  cargo_name: string;
  quantity: string;
  amount: string;
  date: string;
};

export type AccountantActType = {
  amount: string;
  client_bin: string;
  unloading_point: string;
  receipt_address: string;
};

export type WareHouseActType = {
  unloading_point: string;
  cargo_name: string;
  weight: string;
  volume: string;
  quantity: string;
  client_bin: string;
  transportation_manager: string;
  is_unpalletizing: string;
  comments: string;
  sgm_manager: string;
};

export type MscActType = {
  receipt_address: string;
  unloading_point: string;
  cargo_name: string;
  weight: string;
  volume: string;
  driver: string;
  quantity: string;
  client_bin: string;
  status: string;
  is_unpalletizing: string;
  is_documents: string;
};
