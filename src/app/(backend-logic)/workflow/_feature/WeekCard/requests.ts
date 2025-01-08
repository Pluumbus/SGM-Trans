"use client";
import supabase from "@/utils/supabase/client";
import { CargoType } from "../types";
import { TripType } from "../TripCard/TripCard";
import { setRequestStatus } from "@/app/(backend-logic)/requests/_api";
import { ClientRequestStatus } from "@/app/(client-logic)/client/types";
import { editWHCargo } from "../../[slug]/week/[weekId]/trip/[id]/_features/_Table/EditField/api";

export const addWeek = () => {};
export const addTrip = async (data: TripType) => {
  return await supabase.from("trips").insert(data);
};
export const addCargo = async (data: CargoType) => {
  if (data.wh_id) {
    await editWHCargo("is_deleted", true, data.wh_id);
    const { error } = await supabase.from("cargos").insert(data);
    if (error) {
      console.error(error);
      throw new Error();
    }
  } else if (data.request_id) {
    const { error } = await supabase.from("cargos").insert(data);
    setRequestStatus({
      reqId: data.request_id,
      status: ClientRequestStatus.APPROVED,
    });
    if (error) {
      console.error(error);
      throw new Error();
    }
  } else {
    const { error } = await supabase.from("cargos").insert(data);
    if (error) {
      console.error(error);
      throw new Error();
    }
  }
};
