import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";

export type AuditCargosType = {
  id: number;
  created_at: string;
  user_id: string;
  cargo: {
    new: CargoType;
    old: CargoType;
  };
  changed_fields: keyof CargoType[];
  cargo_id: number;
};

export const cargoTypeDictionary: Record<keyof CargoType, string> = {
  id: "Идентификатор",
  trip_id: "Идентификатор рейса",
  created_at: "Дата создания",
  receipt_address: "Адрес получения",
  unloading_point: "Город разгрузки",
  weight: "Вес",
  volume: "Объем",
  quantity: "Количество",
  driver: "Водитель",
  amount: "Сумма",
  is_unpalletizing: "Распалечиваем",
  comments: "Комментарий",
  client_bin: "БИН клиента",
  cargo_name: "Название груза",
  transportation_manager: "Плательщик",
  is_documents: "Наличие документов",
  status: "Статус",
  loading_scheme: "Схема загрузки",
  user_id: "Идентификатор пользователя",
  act_details: "Детали акта",
  paid_amount: "Оплаченная сумма",
  request_id: "Идентификатор запроса",
  is_deleted: "Удалено",
  wh_id: "Идентификатор склада",
};

export const unloadingPointDictionary: Record<
  keyof CargoType["unloading_point"],
  string
> = {
  city: "Город",
  withDelivery: "С доставкой",
  deliveryAddress: "Адрес доставки",
};

export const quantityDictionary: Record<keyof CargoType["quantity"], string> = {
  value: "Значение",
  type: "Тип",
};

export const driverDictionary: Record<keyof CargoType["driver"], string> = {
  id: "Идентификатор водителя",
  value: "Сумма для наемника",
};

export const amountDictionary: Record<keyof CargoType["amount"], string> = {
  value: "Сумма",
  type: "Тип суммы",
};

export const clientBinDictionary: Record<
  keyof CargoType["client_bin"],
  string
> = {
  tempText: "Клиент/получатель",
  snts: "СНТ",
  xin: "ИИН/БИН",
};
