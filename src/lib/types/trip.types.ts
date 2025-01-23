import { WeekType } from "@/app/(backend-logic)/workflow/_feature/types";
import { GeneralTableType } from "./general.types";

export enum WeekDays {
  MONDAY = "ПН",
  TUESDAY = "ВТ",
  WEDNESDAY = "СР",
  THURSDAY = "ЧТ",
  FRIDAY = "ПТ",
  SATURDAY = "СБ",
  SUNDAY = "ВС",
}

export const WEEK_DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const;

export type TripStatusType = "Машина закрыта" | "В пути" | "Прибыл" | WeekDays;

export type TripDTOType = {
  trip_number: number;
  week_id: WeekType["id"];
  driver: { driver: string; car: string; state_number: string };
  city_from: string[];
  city_to: string[];
  status: TripStatusType;
  date_in: string;
  date_out: string;
  exchange_rate: string;
};

export type TripTableType = GeneralTableType & TripDTOType;
