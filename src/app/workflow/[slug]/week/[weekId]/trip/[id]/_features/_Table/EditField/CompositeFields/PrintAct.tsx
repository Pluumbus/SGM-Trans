"use client";
import { CargoType } from "@/app/workflow/_feature/types";
import React, { ReactNode, useState } from "react";
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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ActType, PrintButton } from "@/components/actPrintTemp/actGen";
import { checkRole } from "@/components/roles/useRole";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById } from "../../../../../_api";
import { setUserData } from "@/lib/references/clerkUserType/setUserData";

type Type = CargoType["is_act_ready"];

export const PrintAct = ({ info }: { info: Cell<CargoType, ReactNode> }) => {
  const [values, setValues] = useCompositeStates<Type>(info);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isChecked, setIsChecked] = useState(values?.value || false);
  const actVal = info.row.original.is_act_ready?.value;
  const { data, isFetched } = useQuery({
    queryKey: ["getUserByIdForAct"],
    queryFn: async () => await getUserById(values.user_id),
  });
  const actSign = isFetched && actVal ? data.firstName : "Одобрить";
  const actData: ActType = {
    client_bin: info.row.original.client_bin,
    cargo_name: info.row.original.cargo_name,
    quantity: info.row.original.quantity.value,
    amount: info.row.original.amount.value,
    date: new Date().toLocaleDateString(),
  };
  const { user, isLoaded } = useUser();
  return (
    <div className="flex flex-col gap-2 w-[8rem]">
      <div className="flex flex-col gap-2">
        {checkRole(["Кассир", "Админ"]) ? (
          <Checkbox
            isSelected={values?.value}
            onValueChange={(e) => {
              setValues((prev) => ({
                ...prev,
                value: e,
                user_id: isLoaded && user.id,
              }));
            }}
          >
            {actSign}
          </Checkbox>
        ) : (
          <Checkbox
            isSelected={isChecked}
            onValueChange={(e) => {
              setIsChecked(true);
              onOpen();
            }}
          >
            {actSign}
            <ActModalForLigst
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              cargoPrice={Number(info.row.original.amount.value)}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              setValues={setValues}
            />
          </Checkbox>
        )}
        {actVal && (
          <div>
            <PrintButton actData={actData} />
          </div>
        )}
      </div>
    </div>
  );
};

const ActModalForLigst = ({
  isOpen,
  onOpenChange,
  cargoPrice,
  isChecked,
  setIsChecked,
  setValues,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  cargoPrice: number;
  isChecked: boolean;
  setIsChecked: (value: React.SetStateAction<boolean>) => void;
  setValues: React.Dispatch<
    React.SetStateAction<{
      value: boolean;
      user_id: string;
    }>
  >;
}) => {
  const { user, isLoaded } = useUser();
  const { mutate: setBalanceMutation } = useMutation({
    mutationKey: ["SetBalanceForActUser"],
    mutationFn: async (newBal: number) => {
      await setUserData({
        userId: user.id,
        publicMetadata: {
          role: user.publicMetadata.role as string,
          balance: newBal,
          time: user.publicMetadata.time as number,
          prevTime: user.publicMetadata.prevTime as number,
        },
      });
    },
  });
  return (
    <div>
      {!isChecked && !checkRole(["Кассир", "Админ"]) && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 ">
                  Одобрение груза
                </ModalHeader>
                <ModalBody>
                  <p>
                    При соглашении у вас спишется стоимость груза с баланса в
                    размере <b>{`${cargoPrice}`}</b>и появится возможность
                    распечатать Акт приема-выдачи
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setIsChecked(false);
                      onClose();
                    }}
                  >
                    Нет
                  </Button>
                  <Button
                    color="success"
                    onPress={() => {
                      onClose();
                      setValues((prev) => ({
                        ...prev,
                        value: true,
                        user_id: isLoaded && user.id,
                      }));
                      setBalanceMutation(
                        (user.publicMetadata.balance as number) - cargoPrice
                      );
                      toast({ title: `Печать талона на груз одобрена` });
                    }}
                  >
                    Да
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
