import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { toast } from "@/components/ui/use-toast";
import { getDrivers, getCars } from "@/lib/references/drivers/feature/api";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
  ModalFooter,
} from "@nextui-org/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { updateTripDriver } from "../../../_api/requests";

export const TripInfoDriver = ({
  currentTripData,
  selectedTabId,
}: {
  currentTripData: TripType;
  selectedTabId: number;
}) => {
  const [tripDriver, setTripDriver] = useState(currentTripData?.driver);
  const [tripCar, setTripCar] = useState("");

  const { isOpen, onOpen, onOpenChange: onOpenModalChange } = useDisclosure();

  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["getAllDrivers"],
    queryFn: getDrivers,
  });

  const { data: carData, isLoading: carLoading } = useQuery({
    queryKey: ["getAllCars"],
    queryFn: getCars,
  });

  const { mutate: setDriverMutation } = useMutation({
    mutationKey: ["setTripStatus"],
    mutationFn: async () =>
      await updateTripDriver(tripDriver + " | " + tripCar, selectedTabId),
    onSuccess() {
      toast({
        title: "Водитель рейса успешно обновлён",
      });
    },
  });
  return (
    <div>
      <div className="flex flex-col">
        <span>Водитель: </span>
        <div className="flex justify-between">
          <b className="items-end">{currentTripData?.driver} </b>
          <Button isIconOnly size="sm" color="default" onPress={onOpen}>
            <IoMdSettings />
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenModalChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Замена данных водителя
              </ModalHeader>
              <ModalBody>
                <div>
                  Выберите водителя{" "}
                  {!driversLoading && (
                    <Autocomplete
                      onSelectionChange={(e) => setTripDriver(e.toString())}
                    >
                      {driversData
                        ?.filter((e) => e.car_type === "truck")
                        .map((dr) => (
                          <AutocompleteItem
                            key={`${dr.name}`}
                            textValue={`${dr.name}`}
                            value={`${dr.name}`}
                          >
                            {dr.name}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                  )}
                </div>
                <div>
                  Выберите машину
                  {!carLoading && (
                    <Autocomplete
                      onSelectionChange={(e) => setTripCar(e.toString())}
                    >
                      {carData
                        ?.filter((e) => e.car_type === "truck")
                        .map((c) => (
                          <AutocompleteItem
                            key={`${c.car + " - " + c.state_number}`}
                            textValue={`${c.car + " - " + c.state_number}`}
                            value={`${c.car + " - " + c.state_number}`}
                          >
                            {c.car + " - " + c.state_number}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  onPress={() => {
                    setDriverMutation();
                    onClose();
                  }}
                >
                  Подтвердить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};