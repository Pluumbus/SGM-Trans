"use client";

import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { TripType } from "./TripCard";
import { Button, useDisclosure } from "@nextui-org/react";
import { CargoModal } from "../AddCargoModal/AddCargoModal";
import { CargoType } from "../types";

export const getBaseTripColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<
    CargoType & { trips: TripType }
  >[] = [
    {
      accessorKey: "id",
      header: "Номер рейса",
      size: 20,
      cell: (info: Cell<CargoType & { trips: TripType }, ReactNode>) => {
        return <span>{info.row.original.id}</span>;
      },
      filter: true,
    },
    {
      accessorKey: "driver",
      header: "Водитель",
      size: 30,
      cell: (info: Cell<CargoType & { trips: TripType }, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "city_to",
      header: "Город отправитель",
      size: 20,
      cell: (info: Cell<CargoType & { trips: TripType }, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },

    {
      accessorKey: "city_from",
      header: "Город получатель",
      size: 20,
      cell: (info: Cell<CargoType & { trips: TripType }, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },

    {
      accessorKey: "action",
      header: "",
      size: 20,
      cell: (info: Cell<CargoType & { trips: TripType }, ReactNode>) => (
        <CreateCargo info={info} />
      ),
      filter: false,
    },
  ];

  return columnsConfig;
};

const CreateCargo = ({
  info,
}: {
  info: Cell<CargoType & { trips: TripType }, ReactNode>;
}) => {
  const { isOpen: isOpenCargo, onOpenChange: onOpenChangeCargo } =
    useDisclosure();
  return (
    <div>
      <Button
        onClick={() => {
          onOpenChangeCargo();
        }}
      >
        Добавить груз
      </Button>
      <CargoModal
        trip_id={info.row.original.id}
        isOpenCargo={isOpenCargo}
        onOpenChangeCargo={onOpenChangeCargo}
      />
    </div>
  );
};
