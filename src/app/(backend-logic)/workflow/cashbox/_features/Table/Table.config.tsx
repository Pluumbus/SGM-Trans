import { UseTableColumnsSchema } from "@/tool-kit/ui";

import { Cell } from "@tanstack/react-table";
import { ReactNode, useId } from "react";
import { CiSettings } from "react-icons/ci";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useCashierActions } from "./useCashierActions";
import { divide, isArray } from "lodash";
import { AddPaymentToCargo } from "./Modals/AddPaymentToCargo";
import { getSeparatedNumber, useNumberState } from "@/tool-kit/hooks";

import { PAYMENT_TERMS } from "./Modals/ChangePaymentTerms";
import { customFilter } from "@/tool-kit/ui/UTable/helpers/customFilter";
import { customArrayFilter } from "@/tool-kit/ui/UTable/helpers/customArrayfilter";
import { Operations } from "./Modals";
import { CashboxDTOType, CashboxTableType } from "@/lib/types/cashbox.types";

export const useCashierColumnsConfig =
  (): UseTableColumnsSchema<CashboxTableType>[] => {
    const columnsConfig: UseTableColumnsSchema<CashboxTableType>[] = [
      {
        accessorKey: "client",
        header: "Клиент",
        filter: true,
        filterBy: [
          "client.full_name.first_name",
          "client.full_name.middle_name",
          "client.full_name.last_name",
          "client.company_name",
        ],
        filterFn: customFilter,
        cell: (info: Cell<CashboxTableType, ReactNode>) => (
          <div>
            <FullName
              //@ts-ignore
              value={info.getValue() as CashboxDTOType["client"]}
              operations={
                info.row.original.operations as CashboxDTOType["operations"]
              }
            />
          </div>
        ),
      },
      {
        accessorKey: "amount_to_pay",
        header: "Сумма долга",
        filter: false,
        cell: (info: Cell<CashboxTableType, ReactNode>) => {
          const paidAmount = useNumberState({
            initValue: Number(
              info.getValue() as CashboxDTOType["amount_to_pay"]
            ),
          });
          return <div>{paidAmount?.value || ""}</div>;
        },
      },
      {
        accessorKey: "current_balance",
        header: "Текущий баланс клиента",
        filter: false,
        cell: (info: Cell<CashboxTableType, ReactNode>) => {
          const paidAmount = useNumberState({
            initValue: Number(
              info.getValue() as CashboxDTOType["current_balance"]
            ),
          });
          return <div>{paidAmount.value || ""}</div>;
        },
      },
      {
        accessorKey: "cargos",
        header: "Рейсы клиента",
        filter: true,
        filterBy: ["trip_id"],
        filterFn: customArrayFilter,
        cell: (info: Cell<CashboxTableType, ReactNode>) => {
          const cargos = info.getValue() as CashboxDTOType["cargos"];
          return (
            isArray(cargos) && (
              <div className="grid grid-cols-2 min-w-[250px]">
                {cargos.map((e, i) => (
                  <CargoItem
                    key={e.id}
                    cargo={{ ...e, index: i }}
                    info={info}
                  />
                ))}
              </div>
            )
          );
        },
      },

      {
        accessorKey: "payment_terms",
        header: "Срок оплаты по договору",
        filter: false,
        cell: (info: Cell<CashboxTableType, ReactNode>) => {
          const getTextValueForHrs = (hrs: number): string | null =>
            PAYMENT_TERMS.find((term) => term.hrs === hrs)
              ? PAYMENT_TERMS.find((term) => term.hrs === hrs).textValue
              : null;
          return <div>{getTextValueForHrs(Number(info.getValue()))}</div>;
        },
      },
      {
        accessorKey: "action",
        header: "",
        filter: false,
        cell: (info: Cell<CashboxTableType, ReactNode>) => {
          const actions = useCashierActions(info);
          return (
            <div key={`cashier actions ${info.id}`}>
              <div className="py-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      isIconOnly
                      className="max-w-[30px] max-h-[35px]"
                    >
                      <CiSettings size={20} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions">
                    {actions.map((e) => (
                      <DropdownItem key={e.label} onPress={e.onClick}>
                        {e.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              {actions.map((e) => e.modal)}
            </div>
          );
        },
      },
    ];

    return columnsConfig;
  };

const FullName = ({
  value,
  operations,
}: {
  value: CashboxDTOType["client"];
  operations: CashboxDTOType["operations"];
}) => {
  const disclosure = useDisclosure();
  const TooltipContent = () => (
    <div className="flex flex-col gap-4">
      {value?.comment ? (
        <div className="flex flex-col gap-1">
          <span>Заметка о клиенте:</span>
          <span className="font-semibold">{value.comment}</span>
        </div>
      ) : (
        <span>Дополнительной ифнормации о клиенте нет</span>
      )}
    </div>
  );

  const id = useId();

  if (value?.comment) {
    return (
      <>
        <Tooltip
          content={<TooltipContent />}
          showArrow
          placement="left"
          key={id}
          closeDelay={0}
        >
          <div
            className="flex flex-col gap-1 py-2 cursor-pointer"
            onClick={() => {
              disclosure.onOpenChange();
            }}
          >
            <div className="flex gap-2 font-semibold">
              <span>{value.full_name.first_name}</span>
              <span>{value.full_name.last_name}</span>
              <span>{value.full_name.middle_name || ""}</span>
            </div>

            {value.company_name && (
              <span className="font-semibold">{value.company_name}</span>
            )}
          </div>
        </Tooltip>
        <Operations disclosure={disclosure} operations={operations} />
      </>
    );
  }

  return (
    <>
      <div
        className="flex flex-col gap-1 py-2 cursor-pointer"
        onClick={() => {
          disclosure.onOpenChange();
        }}
      >
        <div className="flex gap-2 font-semibold">
          <span>{value.full_name.first_name}</span>
          <span>{value.full_name.last_name}</span>
          <span>{value.full_name.middle_name || ""}</span>
        </div>

        {value.company_name && (
          <span className="font-semibold">{value.company_name}</span>
        )}
      </div>
      <Operations disclosure={disclosure} operations={operations} />
    </>
  );
};

const CargoItem = ({
  cargo,
  info,
}: {
  cargo: CashboxDTOType["cargos"][number] & { index: number };
  info: Cell<CashboxTableType, ReactNode>;
}) => {
  const paidAmount = getSeparatedNumber(Number(cargo?.paid_amount));
  const amountToPay = getSeparatedNumber(Number(cargo?.amount.value));

  const disclosure = useDisclosure();

  return (
    <>
      <div
        className={`flex flex-col ${cargo.index % 2 == 0 && "border-r-1"} pl-2 border-b-1`}
        onClick={() => {
          disclosure.onOpenChange();
        }}
      >
        <div
          className={`flex gap-2 font-semibold py-1 hover:opacity-80 cursor-pointer ${cargo?.paid_amount < Number(cargo?.amount.value) ? "text-red-700" : "text-green-600"}`}
        >
          <span>№{cargo.trip_number}</span>
          <span>-</span>
          <span>{amountToPay} тг.</span>
        </div>
        {Number(paidAmount) != 0 && (
          <span className="text-xs">Оплачено: {paidAmount}&nbsp;тг</span>
        )}
      </div>
      <AddPaymentToCargo disclosure={disclosure} info={info} cargo={cargo} />
    </>
  );
};
