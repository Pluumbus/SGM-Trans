import {
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { CargoType } from "../types";
import { Body, Footer } from "./ModalParts";
import { useCargoMutation, useValdiateForm } from "./helpers";
import { addCargoOnSubmit } from "./helpers";
import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";

export enum CargoModalMode {
  FROM_REQUEST = "FROM_REQUEST",
  FROM_TABLE = "FROM_TABLE",
}

type CargoModalPropsType = {
  disclosure: ReturnType<typeof useDisclosure>;
  mode?: CargoModalMode;
  trip_id?: number;
  prefilledData?: ClientRequestTypeDTO;
};

export const CargoModal = ({
  mode = CargoModalMode.FROM_TABLE,
  prefilledData,
  disclosure,
  trip_id,
}: CargoModalPropsType) => {
  const { isOpen, onOpenChange } = disclosure;
  console.log("prefilledData", prefilledData);

  const { register, handleSubmit, control, reset, setValue, watch, formState } =
    useForm<CargoType>();
  const { mutate, isPending } = useCargoMutation(onOpenChange, reset);

  const validate = useValdiateForm();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <form
            onSubmit={handleSubmit((data) => {
              validate(data) && addCargoOnSubmit(data, mutate, trip_id);
            })}
          >
            <ModalHeader>Добавить груз</ModalHeader>
            <Divider />
            <Body props={{ register, control, setValue, watch }} />
            <Divider />
            <Footer onOpenChangeCargo={onOpenChange} isPending={isPending} />
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
