import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { WeekType } from "@/app/workflow/_feature/types";

export type WeekTableType = "kz" | "ru";
export type TripAndWeeksIdType = TripType & { weeks: WeekType};
