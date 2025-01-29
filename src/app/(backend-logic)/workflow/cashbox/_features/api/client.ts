"use client";
import {
  CargoType,
  WeekType,
} from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { CashboxType } from "../../types";
import { TripType } from "../../../_feature/TripCard/TripCard";
import { CashboxTableType } from "@/lib/types/cashbox.types";
import { changeUserBalance } from "@/lib/references/clerkUserType/SetUserFuncs";

export const changeClientBalance = async (clientId: number, value: number) => {
  const { data, error } = await supabase
    .from("cashbox")
    .update({ current_balance: value })
    .eq("id", Number(clientId));

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const getTripNumber = async (tripId: number) => {
  const { data, error } = await supabase
    .from("trips")
    .select("trip_number, id, status, weeks(table_type)")
    .eq("id", Number(tripId))
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data satisfies {
    trip_number: number;
    id: number;
    status: TripType["status"];
    weeks: { table_type: WeekType["table_type"] };
  };
};
export const changeClientPaymentTerms = async (
  clientId: number,
  value: number
) => {
  const { data, error } = await supabase
    .from("cashbox")
    .update({ payment_terms: value })
    .eq("id", Number(clientId));

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const changeExactAmountPaidToCargo = async (
  cargo: CashboxTableType["cargos"][number],
  paidAmount: number
) => {
  const { data, error } = await supabase
    .from("cargos")
    .update({ paid_amount: Number(paidAmount) })
    .eq("id", Number(cargo.id))
    .select("user_id, act_details")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  if (data.act_details.is_ready) {
    await changeUserBalance({
      userId: data.user_id,
      addBal: Number(paidAmount),
    });
  }

  return data;
};

export const addOperations = async (
  prevOperations: CashboxType["operations"],
  clientId: CashboxType["id"],
  newOperation: CashboxType["operations"][number]
) => {
  const uPrevOperations = !prevOperations ? [] : prevOperations;
  const { data, error } = await supabase
    .from("cashbox")
    .update({ operations: [...uPrevOperations, newOperation] })
    .eq("id", Number(clientId));

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addPaidAmountToCargo = async (
  cargo: CargoType,
  paidAmount: number
) => {
  const { data, error } = await supabase
    .from("cargos")
    .update({ paid_amount: Number(cargo.paid_amount + paidAmount) })
    .eq("id", Number(cargo.id));

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
