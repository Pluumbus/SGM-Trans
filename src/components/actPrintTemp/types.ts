export type ActType = {
    client_bin: string;
    cargo_name: string;
    quantity: string;
    amount: string;
    date: string;
  };
  
  export type ClientsActType = {
    amount: string;
    transportation_manager: string;
    client_bin: string;
    unloading_point: string;
  };
  
  export type WareHouseActType = {
    unloading_point: string;
    cargo_name: string;
    weight: string;
    volume: string;
    quantity: string;
    client_bin: string;
    transportation_manager: string;
    comments: string;
  };