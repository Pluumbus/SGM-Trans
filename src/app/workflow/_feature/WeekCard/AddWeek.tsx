import { useDisclosure } from "@nextui-org/react";

import { TripModal } from "./Modals/TripModal";
import { CargoModal } from "../AddCargoModal/AddCargoModal";
export const AddWeek = () => {
  const { isOpen: isOpenCargo, onOpenChange: onOpenChangeCargo } =
    useDisclosure();
  return (
    <div>
      <TripModal onOpenChangeCargo={onOpenChangeCargo} />
      <CargoModal
        isOpenCargo={isOpenCargo}
        onOpenChangeCargo={onOpenChangeCargo}
      />
    </div>
  );
};
