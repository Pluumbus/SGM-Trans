import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { updateTripNumber } from "./api";
import { useToast } from "@/components/ui/use-toast";
import { getAllCargos, getTrips } from "../../../_api";
import { useSelectionStore } from "../store";
import { COLORS } from "@/lib/colors";

export const UpdateTripNumber = ({
  currentTripId,
}: {
  currentTripId: number;
}) => {
  const { rowSelected: selectedRows, setRowSelected } = useSelectionStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCargos, setSelectedCargos] = useState<
    {
      number: number;
      isSelected: boolean;
    }[]
  >([]);
  const [cargos, setCargos] = useState<CargoType[]>();
  const [selectedTrip, setSelectedTrip] = useState();

  const { toast } = useToast();

  const { data, isFetched, isLoading } = useQuery({
    queryKey: ["getAllCargos"],
    queryFn: async () => await getAllCargos(),
  });

  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ["getAllTrips"],
    queryFn: async () => await getTrips(),
  });

  useEffect(() => {
    if (selectedRows && data) {
      setSelectedCargos(selectedRows.filter((e) => e.isSelected));
      setCargos(data);
    }
  }, [selectedRows, data]);

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
      setRowSelected([]);
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: `Возникла ошибка при попытке перенести груз(ы) в ${selectedTrip} рейс`,
      });
    },
  });
  const sumCargosColorForTrip = (trip: TripType, isText: boolean) => {
    const sorted = cargos?.filter((cargo) => cargo.trip_id === trip.id);
    const totalWeight = sorted?.reduce(
      (sum, cargo) => sum + parseFloat(cargo.weight),
      0
    );
    const totalVolume = sorted?.reduce(
      (sum, cargo) => sum + parseFloat(cargo.volume),
      0
    );

    const weightCalc =
      totalWeight <= 11
        ? 1
        : totalWeight <= 19.9
          ? 2
          : totalWeight <= 22
            ? 3
            : 10;

    const volumeCalc =
      totalVolume <= 47
        ? 1
        : totalVolume <= 79
          ? 2
          : totalVolume <= 92
            ? 3
            : 10;

    if (isText) {
      return weightCalc + volumeCalc > 6 ? <b>ПЕРЕПОЛНЕН</b> : <></>;
    }

    return weightCalc + volumeCalc <= 2
      ? `${COLORS.green}`
      : weightCalc + volumeCalc <= 4
        ? `${COLORS.yellow}`
        : weightCalc + volumeCalc <= 6
          ? `${COLORS.orange}`
          : `${COLORS.red}`;
  };

  console.log(tripsData);
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
                    <span key={index}>
                      {cargo.number}
                      {index < selectedCargos.length - 1 ? "," : ""}
                    </span>
                  ))}
                  из {currentTripId}
                </div>
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  aria-label="Выберите рейс"
                  label="Выберите рейс"
                  selectedKey={selectedTrip}
                  onSelectionChange={(e) => {
                    setSelectedTrip(e);
                  }}
                >
                  {tripsData
                    ?.filter((trip) => trip.id !== currentTripId)
                    .map((e) => (
                      <AutocompleteItem
                        key={e.id}
                        textValue={`${e.driver} | ${e.id}`}
                        value={e.id}
                        style={{ color: `${sumCargosColorForTrip(e, false)}` }}
                      >
                        {`${e.driver.driver} - ${e.driver.state_number} | ${e.trip_number} рейс`}{" "}
                        {sumCargosColorForTrip(e, true)}
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
