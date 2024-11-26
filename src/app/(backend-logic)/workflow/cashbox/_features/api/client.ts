"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { CashboxType } from "../../types";

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
  cargo: CargoType,
  paidAmount: number
) => {
  const { data, error } = await supabase
    .from("cargos")
    .update({ paid_amount: Number(paidAmount) })
    .eq("id", Number(cargo.id));

  if (error) {
    throw new Error(error.message);
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
