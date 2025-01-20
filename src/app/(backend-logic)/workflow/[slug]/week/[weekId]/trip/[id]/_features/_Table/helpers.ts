"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { useQuery } from "@tanstack/react-query";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { getCargoAudit } from "../UpdateCargo/requests";

export const useLastLogOnField = ({
  info,
  field,
}: {
  info: Cell<CargoType, ReactNode>;
  field: keyof CargoType;
}) => {
  const id = info.row.original.id;
  const { data, isLoading } = useQuery({
    queryKey: [`GetLogs${id}`],
    queryFn: async () => await getCargoAudit(id),
    enabled: !!id,
  });
  if (data) {
    return {
      data: data
        .filter((e) =>
          e.changed_fields?.some((el) => el.includes(field.toString()))
        )
        ?.map((e) => e.cargo.old[field]),
      isLoading,
    };
  } else return [];
};
