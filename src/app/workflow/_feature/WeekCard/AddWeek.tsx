import { useDisclosure } from "@nextui-org/react";
import { CargoModal } from "./Modals/CargoModal";
import { TripModal } from "./Modals/TripModal";
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
