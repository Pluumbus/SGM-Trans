import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { CargoType } from "@/app/workflow/_feature/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { updateTripNumber } from "./api";
import { useToast } from "@/components/ui/use-toast";

export const UpdateTripNumber = ({
  cargos,
  trips,
  selectedRows,
}: {
  cargos: CargoType[];
  trips: TripType[];
  selectedRows: {
    number: number;
    isSelected: boolean;
  }[];
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCargos, setSelectedCargos] = useState<
    {
      number: number;
      isSelected: boolean;
    }[]
  >([]);

  const [selectedTrip, setSelectedTrip] = useState();

  const { toast } = useToast();

  useEffect(() => {
    if (selectedRows) {
      setSelectedCargos(selectedRows.filter((e) => e.isSelected));
    }
  }, [selectedRows]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      selectedCargos.map(async (e) => {
        await updateTripNumber(e.number, selectedTrip);
      });
      onOpenChange();
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: `Вы успешно перенесли груз(ы) в ${selectedTrip} рейс`,
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: `Возникла ошибка при попытке перенести груз(ы) в ${selectedTrip} рейс`,
      });
    },
  });

  return (
    <div className="mt-4">
      <Button
        color="warning"
        onClick={() => {
          onOpen();
        }}
      >
        Перенести выбранные грузы
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex gap-2">
                  Перенести грузы:
                  {selectedCargos.map((cargo, index) => (
                    <span key={index}>{cargo.number}</span>
                  ))}
                </div>
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  label="Выберите водителя"
                  selectedKey={selectedTrip}
                  onSelectionChange={(e) => {
                    setSelectedTrip(e);
                    console.log(selectedTrip);
                  }}
                >
                  {trips.map((e) => (
                    <AutocompleteItem
                      key={e.id}
                      textValue={e.driver}
                      value={e.id}
                    >
                      {e.driver}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => {
                    mutate();
                  }}
                >
                  Перенести
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
