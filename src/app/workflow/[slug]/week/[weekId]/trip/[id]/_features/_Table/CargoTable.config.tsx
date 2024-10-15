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
import { ActType, PrintButton } from "@/components/actPrintTemp/actGen";

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

                console.log("updatedSelection", updatedSelection);

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
              console.log("rowSelected", rowSelected);

              const updatedSelection = rowSelected?.map((item, index) => {
                if (index === info.row.index) {
                  return { ...item, isSelected: !item.isSelected };
                }
                return item;
              });

              setRowSelected(updatedSelection);
            }}
          />
        );
      },
    },

    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   size: 10,
    //   filter: false,
    //   cell: (info: Cell<CargoType, ReactNode>) => (
    //     <span>{info?.getValue()?.toString()}</span>
    //   ),
    // },

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
        <EditField info={info} type={"Text"} cl="min-w-[7rem]" />
      ),
      filter: false,
    },
    {
      accessorKey: "unloading_point",
      header: "Город разгрузки",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField
          info={info}
          type={"Composite"}
          compositeType="unloading_point"
        />
      ),
      filter: false,
    },
    {
      accessorKey: "weight",
      header: () => (
        <div className="flex justify-center w-full">
          <span>Вес</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} cl="!min-w-[2rem]" />
      ),
      filter: false,
    },
    {
      accessorKey: "volume",
      header: () => (
        <div className="flex flex-col items-center justify-center w-full">
          <span>Объем</span>
          <span>м.куб.</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Text"} cl="!min-w-[3rem]" />
      ),
      filter: false,
    },
    {
      accessorKey: "quantity",
      header: "Количество",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <div className="flex gap-2">
          <EditField info={info} type={"Composite"} compositeType="quantity" />
        </div>
      ),
      filter: false,
    },
    {
      accessorKey: "driver",
      header: "Водитель",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Composite"} compositeType="driver" />
      ),
      filter: false,
    },
    {
      accessorKey: "amount",
      header: "Сумма тг.",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Composite"} compositeType="amount" />
      ),
      filter: false,
    },
    {
      accessorKey: "is_unpalletizing",
      header: () => (
        <div className="w-[3rem] flex flex-col items-center">
          <span>Распа</span>
          <span>летир</span>
          <span>ование</span>
        </div>
      ),
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
        <EditField info={info} type={"Text"} cl={"!min-w-[10rem]"} />
      ),
      filter: false,
    },

    {
      accessorKey: "client_bin",
      header: "БИН клиента",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField
          info={info}
          type={"Composite"}
          compositeType="client_bin"
          cl="!min-w-[10rem]"
        />
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
      header: () => (
        <div className="flex flex-col items-center">
          <span>Наличие</span>
          <span>документов</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Checkbox"} />
      ),
      filter: false,
    },
    // {
    //   accessorKey: "status",
    //   header: "Статус",
    //   size: 20,
    //   cell: (info: Cell<CargoType, ReactNode>) => (
    //     <div className="py-1">
    //       <EditField info={info} type={"Composite"} compositeType="status" />
    //     </div>
    //   ),
    //   filter: false,
    // },

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
      accessorKey: "is_act_ready",
      header: "Выдача талона",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField
          info={info}
          type={"Composite"}
          compositeType="is_act_ready"
        />
      ),

      filter: false,
    },
  ];

  return columnsConfig;
};
