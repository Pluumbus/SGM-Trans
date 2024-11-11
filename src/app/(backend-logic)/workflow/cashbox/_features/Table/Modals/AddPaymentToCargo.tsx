import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";

import { Cell } from "@tanstack/react-table";
import { CashboxType } from "../../../types";
import { useToast } from "@/components/ui/use-toast";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  addPaidAmountToCargo,
  changeClientBalance,
  changeExactAmountPaidToCargo,
} from "../../api";
import { useNumberState } from "@/tool-kit/hooks";

type AddPaymentToCargoArgs = {
  disclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  cargo?: CargoType;
  info: Cell<CashboxType, ReactNode>;
};

export const AddPaymentToCargo = ({
  disclosure,
  info,
  cargo,
}: AddPaymentToCargoArgs) => {
  const [formState, setFormState] = useState<null | number>(cargo?.id || null);
  const [isUsingBalance, setIsUsingBalance] = useState<boolean>(false);
  const { toast } = useToast();

  const formattedBalance = useNumberState({
    separator: ",",
  });

  const calculateNewDuty = (currentCargo: CargoType) => {
    const o = info.row.original;
    const balance = isUsingBalance ? Number(o.current_balance) : 0;

    const newCurrBalanceGreaterThanZero = [
      isUsingBalance ? 0 : Number(o.current_balance), // текущий баланс
      balance + currentCargo.paid_amount + formattedBalance.rawValue, // сколько оплачено за груз
    ];

    const newCurrBalanceLessThanZero = [
      Number(o.current_balance) +
        currentCargo.paid_amount +
        formattedBalance.rawValue -
        Number(cargo.amount.value), // текущий баланс

      currentCargo.amount.value, // сколько оплачено за груз
    ];

    const newCurrBalanceEqualZero = [
      Number(o.current_balance) + formattedBalance.rawValue,
      currentCargo.amount.value,
    ];
    const newCurrBalanceFullSinglePayment = [
      Number(o.current_balance),
      currentCargo.amount.value,
    ];
    const comparison =
      Number(currentCargo.amount.value) -
      (currentCargo.paid_amount + formattedBalance.rawValue + balance);

    if (
      (Number(currentCargo.amount.value) - formattedBalance.rawValue === 0 &&
        currentCargo.paid_amount === 0) ||
      Number(currentCargo.amount.value) -
        (formattedBalance.rawValue + Number(currentCargo.paid_amount)) ===
        0
    ) {
      console.log("case 1");
      // +
      return newCurrBalanceFullSinglePayment;
    } else if (
      Number(currentCargo.amount.value) - currentCargo.paid_amount ===
      0
    ) {
      // +
      console.log("case 2");
      return newCurrBalanceEqualZero;
    } else if (comparison > 0) {
      // +
      console.log("case 3");
      return newCurrBalanceGreaterThanZero;
    } else if (comparison < 0) {
      // +
      console.log("case 4");
      return newCurrBalanceLessThanZero;
    } else if (comparison == 0) {
      // +
      console.log("case 5");
      return newCurrBalanceLessThanZero;
    }
  };

  const { mutate: updateBalance } = useMutation({
    mutationFn: async () => {
      const cargo = info.row.original.cargos.find((e) => e.id == formState);
      const [currentBalance, _] = calculateNewDuty(cargo);

      return await changeClientBalance(
        info.row.original.id,
        Number(currentBalance),
      );
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const cargo = info.row.original.cargos.find((e) => e.id == formState);
      const [_, paidAmount] = calculateNewDuty(cargo);
      return await changeExactAmountPaidToCargo(
        info.row.original.cargos.find((e) => e.id == formState),
        Number(paidAmount),
      );
    },
    onSuccess: () => {
      updateBalance();

      toast({
        title: `Успех`,
        description: `Вы успешно добавили оплату для груза №${cargo.id} в №${cargo.trip_id} рейсе`,
      });
      disclosure.onOpenChange();
    },
    onError: () => {
      toast({
        title: `Ошибка`,
        description: `Не удалось добавить оплату для груза №${cargo.id} в №${cargo.trip_id} рейсе`,
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <form
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            Внести платеж за груз
          </ModalHeader>
          <Divider />
          <ModalBody className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Autocomplete
                defaultSelectedKey={cargo && cargo?.id}
                label="Выберите груз"
                selectedKey={formState?.toString() || null}
                onSelectionChange={(e) => {
                  setFormState(Number(e));
                }}
              >
                {info.row.original.cargos.map((el) => {
                  const { value: number } = useNumberState({
                    initValue: Number(el.amount.value),
                  });
                  return (
                    <AutocompleteItem
                      key={el.id}
                      value={el.id}
                      textValue={`№${el.trip_id} - ${number} тг`}
                    >
                      {`№${el.trip_id} - ${number} тг`}
                    </AutocompleteItem>
                  );
                })}
              </Autocomplete>
              <Tooltip
                content={"Использовать текущий баланс клиента"}
                showArrow={true}
                offset={-7}
              >
                <div className="flex items-center justify-center">
                  <Checkbox
                    isSelected={isUsingBalance}
                    onValueChange={(e) => {
                      setIsUsingBalance(e);
                    }}
                  />
                </div>
              </Tooltip>
            </div>
            <AlreadyPaidBadge info={info} formState={formState} />
            <Input
              errorMessage="Добавьте баланс"
              label="Оплата"
              value={formattedBalance.value}
              onChange={(e) => {
                formattedBalance.onChange(e);
              }}
              endContent={isUsingBalance && <InputEndContent info={info} />}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => {
                disclosure.onOpenChange();
              }}
              isLoading={isPending}
            >
              Закрыть
            </Button>
            <Button color="success" type="submit" isLoading={isPending}>
              Внести платеж
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const InputEndContent = ({ info }: { info: AddPaymentToCargoArgs["info"] }) => {
  const val = useNumberState({
    initValue: Number(info.row.original.current_balance),
  });
  return <span className="text-sm">+&nbsp;{val.value}</span>;
};

const AlreadyPaidBadge = ({
  info,
  formState,
}: {
  info: AddPaymentToCargoArgs["info"];
  formState: number;
}) => {
  const tmp = useNumberState({
    initValue: info.row.original.cargos.find((e) => e.id == formState)
      ?.paid_amount,
  });

  return (
    tmp.value && (
      <span className="text-xs pl-1 ">
        Оплачено:&nbsp;
        {tmp.value || ""}
      </span>
    )
  );
};
