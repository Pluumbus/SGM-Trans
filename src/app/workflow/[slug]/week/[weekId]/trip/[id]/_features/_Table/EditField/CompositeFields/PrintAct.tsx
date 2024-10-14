"use client";
import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode, useEffect, useState } from "react";
import { useCompositeStates } from "./helpers";
import { Cell } from "@tanstack/react-table";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ActType, PrintButton } from "@/components/actPrintTemp/actGen";
import { useCheckRole } from "@/components/roles/useRole";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById } from "../../../../../_api";
import { setUserData } from "@/lib/references/clerkUserType/setUserData";

type Type = CargoType["is_act_ready"];

export const PrintAct = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);

  const { user } = useUser();
  const { onOpenChange, isOpen } = useDisclosure();
  const initText = `Одобрить`;
  const [givingActText, setGivingActText] = useState<string>(initText);

  const { mutate, isPending } = useMutation({
    mutationKey: [`get user ${info.row.original.user_id.toString()}`],
    mutationFn: async () => await getUserById(values?.user_id),
    onSuccess: (res) => {
      if (values.value) {
        setGivingActText(`Одобрил: ${res.firstName}`);
      } else {
        setGivingActText(initText);
      }
    },
  });

  useEffect(() => {
    if (values.user_id && values.value) {
      mutate();
    }
  }, [values.user_id]);

  useEffect(() => {
    if (!values.value) {
      setGivingActText(initText);
    } else {
      mutate();
    }
  }, [values.value]);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-2 w-[8rem]">
      <div className="flex flex-col gap-2">
        {useCheckRole(["Кассир", "Админ"]) ? (
          <Checkbox
            isSelected={values.value}
            onValueChange={(e) => {
              setValues({
                user_id: user?.id,
                value: e,
              });
            }}
          >
            {givingActText}
          </Checkbox>
        ) : values.value ? (
          <Checkbox isSelected={values.value}>{givingActText}</Checkbox>
        ) : (
          <Button
            onClick={() => {
              onOpenChange();
            }}
          >
            <span>{givingActText}</span>
          </Button>
        )}
        {values.value && (
          <div>
            <PrintButton
              actData={{
                client_bin: info.row.original.client_bin,
                cargo_name: info.row.original.cargo_name,
                quantity: info.row.original.quantity.value,
                amount: info.row.original.amount.value,
                date: new Date().toLocaleDateString(),
              }}
            />
          </div>
        )}
      </div>
      <GlobalActModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        cargoPrice={Number(info.row.original.amount.value)}
        setValues={setValues}
      />
    </div>
  );
};

const GlobalActModal = ({
  onOpenChange,
  isOpen,
  cargoPrice,
  setValues,
}: {
  onOpenChange: () => void;
  cargoPrice: number;
  isOpen: boolean;
  setValues: React.Dispatch<
    React.SetStateAction<{
      value: boolean;
      user_id: string;
    }>
  >;
}) => {
  const { user } = useUser();
  const { mutate: setBalanceMutation, isPending } = useMutation({
    mutationKey: ["SetBalanceForActUser"],
    mutationFn: async (newBal: number) => {
      await setUserData({
        userId: user?.id,
        publicMetadata: {
          role: user?.publicMetadata.role as string,
          balance: newBal,
          time: user?.publicMetadata.time as number,
          prevTime: user?.publicMetadata.prevTime as number,
        },
      });
    },
    onSuccess: () => {
      setValues(() => ({
        value: true,
        user_id: user?.id,
      }));
      onOpenChange();
      toast({ title: `Печать талона на груз одобрена` });
    },
  });
  const res = (user?.publicMetadata.balance as number) - cargoPrice;
  return (
    <div>
      <Modal onOpenChange={onOpenChange} isOpen={isOpen} isDismissable={false}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              Одобрение груза
            </ModalHeader>
            <ModalBody>
              {res < 0 || res > (user?.publicMetadata.balance as number) ? (
                <p>Недостаточно баланса</p>
              ) : (
                <p>
                  При соглашении у вас спишется стоимость груза с баланса в
                  размере <b>{`${cargoPrice}`}</b> и появится возможность
                  распечатать Акт приема-выдачи
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                isLoading={isPending}
                onPress={() => {
                  setValues((prev) => ({ ...prev, value: false }));
                }}
              >
                Закрыть
              </Button>
              {!(res < 0 || res > (user?.publicMetadata.balance as number)) && (
                <Button
                  isLoading={isPending}
                  color="success"
                  onPress={() => {
                    setBalanceMutation(res);
                  }}
                >
                  Да
                </Button>
              )}
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};
