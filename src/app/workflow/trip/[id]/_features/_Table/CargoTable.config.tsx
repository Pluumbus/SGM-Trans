"use client";
import { CargoType } from "@/app/workflow/_feature/types";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { EditField } from "./EditField/EditField";
import { getUserById } from "../../../_api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/react";

export const getBaseColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<CargoType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 10,
      filter: false,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <span>{Number(info.row.id) + 1}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Дата создания",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <span>{new Date(info?.getValue() as string).toLocaleDateString()}</span>
      ),
      filter: true,
    },
    {
      accessorKey: "receipt_address",
      header: "Адрес получения",
      size: 30,
      cell: (info: Cell<CargoType, ReactNode>) => (
        // <span>{info.getValue()?.toString()}</span>
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "unloading_city",
      header: "Город разгрузки",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "weight",
      header: "Вес",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "volume",
      header: "Объем",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "quantity",
      header: "Количество",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <div className="flex gap-2">
          <EditField info={info} type={"Composite"} />
        </div>
      ),
      filter: false,
    },

    {
      accessorKey: "amount",
      header: "Сумма тг.",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "is_unpalletizing",
      header: "Распалетирование",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Checkbox"} />
      ),
      filter: false,
    },
    {
      accessorKey: "comments",
      header: "Комментарии",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "client_name",
      header: "Имя клиента",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "client_bin",
      header: "БИН клиента",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "cargo_name",
      header: "Название груза",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "payer",
      header: "Плательщик",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "transportation_manager",
      header: "Менеджер по перевозкам",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "is_documents",
      header: "Наличие документов",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Checkbox"} />
      ),
      filter: false,
    },
    {
      accessorKey: "status",
      header: "Статус",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "arrival_date",
      header: "Дата прибытия",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <div className="min-w-40">
          <EditField info={info} type={"Date"} />
        </div>
      ),
      filter: false,
    },
    {
      accessorKey: "user_id",
      header: "Менеджер SGM",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { data, isLoading } = useQuery({
          queryKey: ["get user"],
          queryFn: async () => await getUserById(info.getValue().toString()),
        });
        if (isLoading) {
          return <Spinner />;
        }
        return (
          <span>{`${data?.firstName || ""} ${data?.lastName || ""}`}</span>
        );
      },
      filter: false,
    },
    {
      accessorKey: "payment",
      header: "Оплата",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
    {
      accessorKey: "loading_scheme",
      header: "Схема загрузки",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} />
      ),
      filter: false,
    },
  ];

  return columnsConfig;
};
