"use client";

import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { TripType } from "./TripCard";

export const getBaseTripColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<TripType>[] = [
    {
      accessorKey: "trip_number",
      accessorFn: () => {},
      header: "Номер рейса",
      size: 20,
      cell: (info: Cell<TripType, ReactNode>) => (
        <span>{info?.getValue()?.toString()}</span>
      ),
      filter: true,
    },
    {
      accessorKey: "weight",
      header: "Вес",
      accessorFn: () => {},
      size: 30,
      cell: (info: Cell<TripType, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "volume",
      accessorFn: () => {},
      header: "Объем",
      size: 20,
      cell: (info: Cell<TripType, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },

    {
      accessorKey: "quantity",
      accessorFn: () => {},
      header: "Кол-во",
      size: 20,
      cell: (info: Cell<TripType, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "amount",
      header: "Сумма",
      accessorFn: () => {},
      size: 20,
      cell: (info: Cell<TripType, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
  ];

  return columnsConfig;
};
