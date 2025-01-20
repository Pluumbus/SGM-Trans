"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { useUpdateCargoContext } from "./Context";
import { AuditCargosType } from "./types";

const updateCargo = async (values: CargoType) => {
  const { error } = await supabase
    .from("cargos")
    .update(values)
    .eq("id", values.id);

  if (error) {
    throw new Error(error.message);
  }
};
export const getCargoAudit = async (
  id: CargoType["id"]
): Promise<AuditCargosType[]> => {
  const { data, error } = await supabase
    .from("audit_cargos")
    .select("*")
    .eq("cargo_id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data as AuditCargosType[];
};

export const useUpdateCargo = () => {
  const { disclosure } = useUpdateCargoContext();

  return useMutation({
    mutationFn: updateCargo,
    onSuccess: () => {
      disclosure.onClose();
    },
  });
};
