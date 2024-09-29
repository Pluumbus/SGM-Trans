"use client";
import { CargoType } from "@/app/workflow/_feature/types";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { EditField } from "./EditField/EditField";
import { getUserById } from "../../../_api";
import { useQuery } from "@tanstack/react-query";
import { Checkbox, Spinner } from "@nextui-org/react";
import { useSelectionStore } from "../store";

export const getBaseColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<CargoType>[] = [
    {
      accessorKey: "CheckBox",
      header: () => {
        const { rowSelected, setRowSelected } = useSelectionStore();
        return (
          <div>
            <Checkbox
              isSelected={rowSelected?.every((e) => e.isSelected)}
              onChange={() => {
                const updatedSelection = rowSelected?.map((item) => ({
                  ...item,
                  isSelected: true,
                }));
                console.log("isSelected: header: ", rowSelected);

                setRowSelected(updatedSelection);
              }}
            />
          </div>
        );
      },
      size: 10,
      filter: false,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { rowSelected, setRowSelected } = useSelectionStore();
        return (
          <Checkbox
            isSelected={
              rowSelected &&
              rowSelected.find((e) => e.number == info.row.original.id)
                ?.isSelected
            }
            onChange={() => {
              const updatedSelection = rowSelected?.map((item, index) => {
                if (index === info.row.index) {
                  return { ...item, isSelected: !item.isSelected };
                }
                return item;
              });
              console.log("isSelected: cell: ", rowSelected);
              setRowSelected(updatedSelection);
            }}
          />
        );
      },
    },
    {
      accessorKey: "id",
      header: "ID",
      size: 10,
      filter: false,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <span>{info.getValue().toString()}</span>
      ),
    },

    {
      accessorKey: "created_at",
      header: "Дата создания",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <span>{new Date(info?.getValue() as string).toLocaleDateString()}</span>
      ),
      filter: false,
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
      filter: true,
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
          queryKey: [`get user ${info.getValue().toString()}`],
          queryFn: async () => await getUserById(info.getValue().toString()),
        });
        if (isLoading) {
          return <Spinner />;
        }
        return (
          <div>
            <span>{`${data?.firstName || ""} ${data?.lastName || ""}`}</span>
          </div>
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
