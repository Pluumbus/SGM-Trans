import { CargoType } from "../../types";

export type WHCargoType = Pick<
  CargoType,
  | "id"
  | "receipt_address"
  | "client_bin"
  | "created_at"
  | "weight"
  | "volume"
  | "quantity"
  | "comments"
  | "cargo_name"
  | "is_documents"
  | "user_id"
  | "trip_id"
  | "unloading_point"
  | "is_deleted"
  | "status"
  | "driver"
  | "loading_scheme"
  | "is_unpalletizing"
  
  
>;
