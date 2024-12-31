"use client";

import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { TripType } from "./TripCard";
import { Button, useDisclosure } from "@nextui-org/react";
import { CargoModal } from "../AddCargoModal";
import { WeekType } from "../types";

export const getBaseTripColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<TripType & { weeks: WeekType }>[] =
    [
      {
        accessorKey: "id",
        header: "Номер рейса",
        size: 20,
        cell: (info: Cell<TripType & { weeks: WeekType }, ReactNode>) => {
          return <span>{info.row.original.trip_number}</span>;
        },
        filter: true,
      },
      {
        accessorKey: "driver",
        header: "Водитель",
        size: 30,
        cell: (info: Cell<TripType & { weeks: WeekType }, ReactNode>) => {
          const driverData = info.row.original.driver;
          if (typeof info.getValue() == "string") {
            return <div>{info.getValue()}</div>;
          }
          return (
            <div>
              {driverData.driver + " | " + driverData.car ||
                "" + " - " + driverData.state_number}
            </div>
          );
        },
        filter: false,
      },
      {
        accessorKey: "city_from",
        header: "Город отправитель",
        size: 20,
        cell: (info: Cell<TripType & { weeks: WeekType }, ReactNode>) => (
          <span>{info.getValue()?.toString()}</span>
        ),
        filter: false,
      },

      {
        accessorKey: "city_to",
        header: "Город получатель",
        size: 20,
        cell: (info: Cell<TripType & { weeks: WeekType }, ReactNode>) => (
          <span>{info.getValue()?.toString()}</span>
        ),
        filter: false,
      },

      {
        accessorKey: "action",
        header: "",
        size: 20,
        cell: (info: Cell<TripType & { weeks: WeekType }, ReactNode>) => (
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
  info: Cell<TripType & { weeks: WeekType }, ReactNode>;
}) => {
  const disclosure = useDisclosure();
  return (
    <div className="flex items-center w-full h-full py-1">
      <Button
        variant="ghost"
        onPress={() => {
          disclosure.onOpenChange();
        }}
      >
        Добавить груз
      </Button>
      <CargoModal trip_id={info.row.original.id} disclosure={disclosure} />
    </div>
  );
};
