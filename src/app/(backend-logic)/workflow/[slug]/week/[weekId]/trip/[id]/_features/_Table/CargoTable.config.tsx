"use client";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { EditField } from "./EditField/EditField";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/(backend-logic)/workflow/_feature";
import { useFieldFocus } from "../Contexts/CargoTableContext";
import { getDriversWithCars } from "@/lib/references/drivers/feature/api";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { formatDateMonth } from "@/lib/helpers/formatDate";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { useSelectionContext } from "../Contexts";
import { getCargoAudit } from "../UpdateCargo/requests";
import { useLastLogOnField } from "./helpers";
import { customFilter } from "@/tool-kit/ui/UTable/helpers/customFilter";

export const getBaseColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<CargoType>[] = [
    {
      accessorKey: "CheckBox",
      header: () => {
        const [rowSelected, __, update] = useSelectionContext();

        const [isSelected, setIsSelected] = useState<boolean>(
          rowSelected?.every((e) => e.isSelected)
        );
        return (
          <div>
            <Checkbox
              isSelected={isSelected}
              onValueChange={(e) => {
                setIsSelected(e);
                update(undefined);
              }}
            />
          </div>
        );
      },
      size: 10,
      filter: false,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const [_, __, update] = useSelectionContext();
        const [isSelected, setIsSelected] = useState<boolean>(false);
        return (
          <Checkbox
            isSelected={isSelected}
            onValueChange={(e) => {
              setIsSelected(e);
              update(info.row.original.id);
            }}
            className="flex flex-col-reverse items-center justify-center"
          >
            <span className="text-center w-full font-semibold">
              {Number(info.row.id) + 1}
            </span>
          </Checkbox>
        );
      },
    },

    {
      accessorKey: "receipt_address",
      header: () => (
        <div className="flex flex-col gap-1 items-center">
          <span>Адрес получения</span>
        </div>
      ),
      size: 10,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        return (
          <div onClick={() => setValue(info.column.columnDef.accessorKey)}>
            <ScrollShadow className="max-h-[10rem]  max-w-[10rem]">
              <span>{original.receipt_address}</span>
            </ScrollShadow>
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <div className="my-1">
      //     <EditField info={info} type={"Composite"} compositeType="address" />
      //   </div>
      // ),
      filter: false,
    },
    {
      accessorKey: "unloading_point",
      header: "Город разгрузки",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        return (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            <b>{original.unloading_point.city}</b>
            <span>
              {original.unloading_point.deliveryAddress ??
                original.unloading_point.deliveryAddress}
            </span>
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField
      //     info={info}
      //     type={"Composite"}
      //     compositeType="unloading_point"
      //   />
      // ),
      filter: false,
    },
    {
      accessorKey: "weight",
      header: () => (
        <div className="flex flex-col justify-center w-full">
          <span>Вес</span>
          <span>(тонн)</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();
        const { data, isLoading } = useLastLogOnField({
          field: "weight",
          info: info,
        });

        return (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            <span className="flex justify-center text-gray-400">
              {!isLoading && data && data[data.length - 1]?.toString()}
            </span>
            <span>{original.weight}</span>
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Text"} cl="!min-w-[3rem]" />
      // ),
      filter: false,
    },
    {
      accessorKey: "volume",
      header: () => (
        <div className="flex flex-col items-center justify-center w-full">
          <span>Объем</span>
          <span>(м.куб.)</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        const { data, isLoading } = useLastLogOnField({
          field: "volume",
          info: info,
        });

        return (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            <div className="flex flex-col gap-1 text-gray-400">
              {!isLoading && data && data[data.length - 1]?.toString()}
            </div>
            <span>{original.volume}</span>
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Text"} cl="!min-w-[3rem]" />
      // ),
      filter: false,
    },
    {
      accessorKey: "quantity",
      header: "Количество",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        return (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            <span>{original.quantity.value}</span>
            <span>{original.quantity.type}</span>
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <div className="flex gap-2">
      //     <EditField info={info} type={"Composite"} compositeType="quantity" />
      //   </div>
      // ),
      filter: false,
    },
    {
      accessorKey: "driver",
      header: "Водитель",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        const { data } = useQuery({
          queryKey: ["getDriversWithGazellCars"],
          queryFn: getDriversWithCars,
        });
        const driver = data?.filter(
          (d) => d.id.toString() === original.driver?.id
        )[0]?.name;

        return (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            <span>{driver}</span>
            {original.driver?.id === "24" && (
              <span>{original.driver.value}</span>
            )}
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Composite"} compositeType="driver" />
      // ),
      filter: false,
    },
    {
      accessorKey: "amount",
      header: "Сумма тг.",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        const { data, isLoading } = useLastLogOnField({
          field: "amount",
          info: info,
        });

        return (
          <div onClick={() => setValue(info.column.columnDef.accessorKey)}>
            <span className="flex justify-center text-gray-400">
              {!isLoading && data && data[data.length - 1]?.value.toString()}
            </span>
            <span className="flex justify-center">
              {getSeparatedNumber(Number(original.amount.value))}
            </span>
            <span className="flex justify-center w-full text-sm">
              {original.amount.type ?? original.amount.type}
            </span>
          </div>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Composite"} compositeType="amount" />
      // ),
      filter: false,
    },
    {
      accessorKey: "is_unpalletizing",
      header: () => (
        <div className="w-[2rem] flex flex-col items-center">
          <span>Распа</span>
          <span>летир</span>
          <span>ование</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        return (
          <span
            className="flex justify-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            {original.is_unpalletizing ? "Да" : ""}
          </span>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Checkbox"} />
      // ),
      filter: false,
    },

    {
      accessorKey: "comments",
      header: "Комментарии",
      size: 10,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        return (
          <div
            className="flex justify-center items-center p-2 max-h-[12rem] max-w-[8rem] break-words "
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            <ScrollShadow
              className="max-h-[10rem]  max-w-full"
              onClick={() => setValue(info.column.columnDef.accessorKey)}
            >
              {original.comments}
            </ScrollShadow>
          </div>
        );
      },
      filter: false,
    },

    // {
    //   accessorKey: "comments",
    //   header: "Комментарии",
    //   size: 25,
    //   cell: (info: Cell<CargoType, ReactNode>) => (
    //     <EditField info={info} type={"Text"} cl={"!min-w-[6rem]"} />
    //   ),
    //   filter: false,
    // },

    {
      accessorKey: "client_bin",
      header: "Получатель",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const [value, setValue] = useFieldFocus();

        return (
          <div onClick={() => setValue(info.column.columnDef.accessorKey)}>
            <EditField
              info={info}
              type={"Composite"}
              compositeType="client_bin"
              cl="!min-w-[10rem] "
            />
          </div>
        );
      },
      filter: true,
      filterBy: ["client_bin.tempText", "client_bin.xin"],
      filterFn: customFilter,
    },
    {
      accessorKey: "is_documents",
      header: () => (
        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center w-[2rem]">
            <span>Нали</span>
            <span>чие</span>
            <span>доку</span>
            <span>ментов</span>
          </div>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();
        return (
          <span
            className="flex justify-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            {original.is_documents ? "Да" : "Нет"}
          </span>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Checkbox"} />
      // ),
      filter: false,
    },
    {
      accessorKey: "cargo_name",
      header: "Название груза",
      size: 25,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        return (
          <span
            className="flex justify-start  items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            {original.cargo_name}
          </span>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <EditField info={info} type={"Text"} />
      // ),
      filter: false,
    },

    {
      accessorKey: "transportation_manager",
      header: "Менеджер по перевозкам",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const [value, setValue] = useFieldFocus();
        return (
          <div onClick={() => setValue(info.column.columnDef.accessorKey)}>
            <EditField
              info={info}
              type={"Composite"}
              compositeType="transportation_manager"
            />
          </div>
        );
      },

      filter: false,
    },

    {
      accessorKey: "status",
      header: "Статус",
      size: 20,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const [value, setValue] = useFieldFocus();
        const { original } = info.row;
        // console.log(original.status);
        return (
          <span
            className="flex justify-center w-[6rem] items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            {formatDateMonth(original.status)}
          </span>
        );
      },
      // cell: (info: Cell<CargoType, ReactNode>) => (
      //   <div className="py-1">
      //     <EditField info={info} type={"Composite"} compositeType="status" />
      //   </div>
      // ),
      filter: false,
    },

    {
      accessorKey: "user_id",
      header: () => (
        <div className="flex flex-col w-8">
          <span>Менеджер</span>
        </div>
      ),
      size: 10,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const { original } = info.row;
        const [value, setValue] = useFieldFocus();

        const { data } = useQuery({
          queryKey: ["getUsersList"],
          queryFn: async () => await getUserList(),
        });
        const currUser = data?.filter(
          (user) => user.id === original.user_id
        )[0];
        return (
          <span
            className="flex justify-start  items-center"
            onClick={() => setValue(info.column.columnDef.accessorKey)}
          >
            {currUser?.userName}
          </span>
        );
      },

      filter: false,
    },
    {
      accessorKey: "act_details",
      header: () => (
        <div className="flex flex-col gap-1">
          <span>Выдача</span>
          <span>талона</span>
        </div>
      ),
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => (
        <EditField info={info} type={"Composite"} compositeType="act_details" />
      ),

      filter: false,
      // },
    },
    {
      accessorKey: "action",
      header: "",
      size: 15,
      cell: (info: Cell<CargoType, ReactNode>) => {
        const disclosure = useDisclosure();
        return (
          <>
            <Button
              variant="flat"
              color="success"
              fullWidth
              onPress={() => {
                disclosure.onOpenChange();
              }}
            >
              Создать груз
            </Button>
            <CargoModal
              disclosure={disclosure}
              trip_id={info.row.original.trip_id}
              prefilledData={info.row.original}
            />
          </>
        );
      },

      filter: false,
    },
  ];

  return columnsConfig;
};
