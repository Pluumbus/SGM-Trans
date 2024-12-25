import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";

export type ClientRequestType = {
  weight: CargoType["weight"];
  quantity: CargoType["quantity"];
  volume: CargoType["volume"];
  unloading_point: CargoType["unloading_point"];
  client_bin: CargoType["client_bin"];
  departure: string;
  comments: string;
  created_at: string;
  cargo_name: string;
  status: ClientRequestStatus;
  logist_id?: string;
  phone_number: string;
};

export type ClientRequestTypeDTO = ClientRequestType & {
  user_id: string;
};

type ClientRequestStatus =
  | "Создана"
  | "В рассмотрении логистом"
  | "Заявка одобрена"
  | "Заявка отклонена";
