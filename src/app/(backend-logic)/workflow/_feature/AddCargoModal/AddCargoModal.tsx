import { Divider, Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { CargoType } from "../types";
import { Body, Footer } from "./ModalParts";
import { useCargoMutation, useValdiateForm } from "./helpers";
import { addCargoOnSubmit } from "./helpers";
import { TripType } from "../TripCard/TripCard";

export const CargoModal = ({
  isOpenCargo,
  onOpenChangeCargo,
  trip_number,
  tripsData,
}: {
  trip_number: number;
  tripsData: TripType[];
  isOpenCargo: boolean;
  onOpenChangeCargo: () => void;
}) => {
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<CargoType>();
  const { mutate, isPending } = useCargoMutation(onOpenChangeCargo, reset);

  const validate = useValdiateForm();

  const currentTripId = tripsData?.find(
    (tr) => tr.trip_number === trip_number
  )?.id;
  return (
    <>
      <Modal isOpen={isOpenCargo} onOpenChange={onOpenChangeCargo} size="2xl">
        <ModalContent>
          <form
            onSubmit={handleSubmit((data) => {
              validate(data) && addCargoOnSubmit(data, mutate, currentTripId);
            })}
          >
            <ModalHeader>Добавить груз</ModalHeader>
            <Divider />
            <Body props={{ register, control, setValue, watch }} />
            <Divider />
            <Footer
              onOpenChangeCargo={onOpenChangeCargo}
              isPending={isPending}
            />
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
