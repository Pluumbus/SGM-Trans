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
  useDisclosure,
} from "@nextui-org/react";
import { useCashierActions } from "./useCashierActions";
import { isArray } from "lodash";
import { AddPaymentToCargo } from "./Modals/AddPaymentToCargo";
import { useNumberState } from "@/tool-kit/hooks";

export const useCashierColumnsConfig =
  (): UseTableColumnsSchema<CashboxType>[] => {
    const columnsConfig: UseTableColumnsSchema<CashboxType>[] = [
      {
        accessorKey: "client",
        header: "Клиент",
        filter: true,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div className="font-semibold">{info.getValue().toString()}</div>
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
              info.getValue() as CashboxType["current_balance"],
            ),
          });
          return <div>{paidAmount.value || ""}</div>;
        },
      },

      // {
      //   accessorKey: "rest_amount_needed_to_be_payed",
      //   header: "Остаток",
      //   filter: false,
      //   cell: (info: Cell<CashboxType, ReactNode>) => (
      //     <div>
      //       {Number(info.row.original.amount_to_pay) -
      //         Number(info.row.original.current_balance)}
      //     </div>
      //   ),
      // },

      {
        accessorKey: "cargos",
        header: "Рейсы клиента",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) =>
          isArray(info.getValue()) && (
            <div className="grid grid-cols-2 min-w-[250px]">
              {(info.getValue() as CashboxType["cargos"]).map((e, i) => {
                const paidAmount = useNumberState({ initValue: e.paid_amount });
                const amountToPay = useNumberState({
                  initValue: Number(e.amount.value),
                });
                const disclosure = useDisclosure();
                return (
                  <>
                    <div
                      className={`flex flex-col  ${i % 2 == 0 && "border-r-1"} pl-2 border-b-1`}
                      onClick={() => {
                        disclosure.onOpenChange();
                      }}
                    >
                      <div
                        className={`flex gap-2 font-semibold py-1 hover:opacity-80 cursor-pointer ${e.paid_amount < Number(e.amount.value) ? "text-red-700" : "text-green-600"}`}
                      >
                        <span>№{e.trip_id}</span>
                        <span>-</span>
                        <span>{amountToPay.value} тг.</span>
                      </div>
                      {e.paid_amount !== 0 && (
                        <span className="text-xs">
                          Оплачено: {paidAmount.value}&nbsp;тг
                        </span>
                      )}
                    </div>
                    <AddPaymentToCargo
                      disclosure={disclosure}
                      info={info}
                      cargo={e}
                    />
                  </>
                );
              })}
            </div>
          ),
      },
      {
        accessorKey: "payment_terms",
        header: "Срок оплаты по договору",
        filter: false,
        cell: (info: Cell<CashboxType, ReactNode>) => (
          <div>{info.getValue()}</div>
        ),
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
