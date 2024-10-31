import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { WeekType } from "@/app/(backend-logic)/workflow/_feature/types";

export type WeekTableType = "kz" | "ru";
export type TripAndWeeksIdType = TripType & { weeks: WeekType };
