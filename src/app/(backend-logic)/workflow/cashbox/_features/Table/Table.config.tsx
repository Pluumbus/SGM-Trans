import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { CashboxType } from "../../types";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
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
import Link from "next/link";
import { PAYMENT_TERMS } from "./Modals/ChangePaymentTerms";

export const useCashierColumnsConfig =
  (): UseTableColumnsSchema<CashboxType>[] => {
    const columnsConfig: UseTableColumnsSchema<CashboxType>[] = [
      {
        accessorKey: "client",
        header: "Клиент",
        filter: true,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div>
            {/* 
            //@ts-ignore */}
            <FullName value={info.getValue() as CashboxType["client"]} />
          </div>
        ),
      },
      {
        accessorKey: "amount_to_pay",
        header: "Сумма долга",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => {
          const paidAmount = useNumberState({
            initValue: Number(info.getValue() as CashboxType["amount_to_pay"]),
          });
          return <div>{paidAmount.value || ""}</div>;
        },
      },
      {
        accessorKey: "current_balance",
        header: "Текущий баланс клиента",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => {
          const paidAmount = useNumberState({
            initValue: Number(
              info.getValue() as CashboxType["current_balance"]
            ),
          });
          return <div>{paidAmount.value || ""}</div>;
        },
      },
      {
        accessorKey: "cargos",
        header: "Рейсы клиента",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => {
          const cargos = info.getValue() as CashboxType["cargos"];
          return (
            isArray(cargos) && (
              <div className="grid grid-cols-2 min-w-[250px]">
                {cargos.map((e, i) => (
                  <CargoItem
                    key={e.trip_id}
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
        cell: (info: Cell<CashboxType, ReactNode>) => {
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
        cell: (info: Cell<CashboxType, ReactNode>) => {
          const actions = useCashierActions(info);
          return (
            <div>
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
                      <DropdownItem key={e.label} onClick={e.onClick}>
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

const FullName = ({ value }: { value: CashboxType["client"] }) => {
  const TooltipContent = () => (
    <div className="flex flex-col gap-4">
      {value.company_name && (
        <div className="flex flex-col gap-1">
          <span>Компания на которую работает менеджер: </span>
          <span className="font-semibold">{value.company_name}</span>
        </div>
      )}
      {value.comment && (
        <div className="flex flex-col gap-1">
          <span>Заметка о клиенте:</span>
          <span className="font-semibold">{value.comment}</span>
        </div>
      )}
      <span className="text-center">
        Нажмите чтобы написать клиенту на WhatsApp
      </span>
    </div>
  );
  return (
    <Tooltip content={<TooltipContent />}>
      <Link href={`https://wa.me/${value.phone_number}`} target="_blank">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 font-semibold">
            <span>{value.full_name.first_name}</span>
            <span>{value.full_name.last_name}</span>
            <span>{value.full_name.middle_name || ""}</span>
          </div>
          <div>
            <span className="text-green-800 font-semibold">
              {value.phone_number}
            </span>
          </div>
        </div>
      </Link>
    </Tooltip>
  );
};

const CargoItem = ({ cargo, info }) => {
  const paidAmount = getSeparatedNumber(Number(cargo.paid_amount));
  const amountToPay = getSeparatedNumber(Number(cargo.amount.value));

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
          className={`flex gap-2 font-semibold py-1 hover:opacity-80 cursor-pointer ${cargo.paid_amount < Number(cargo.amount.value) ? "text-red-700" : "text-green-600"}`}
        >
          <span>№{cargo.trip_id}</span>
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
