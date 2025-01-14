"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { useUpdateCargoContext } from "./Context";

const updateCargo = async (values: CargoType) => {
  const { error } = await supabase
    .from("cargos")
    .update(values)
    .eq("id", values.id);

  if (error) {
    throw new Error(error.message);
  }
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
