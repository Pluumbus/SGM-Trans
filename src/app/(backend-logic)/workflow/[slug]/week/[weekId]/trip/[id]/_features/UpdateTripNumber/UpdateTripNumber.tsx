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
  Spinner,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { updateTripNumber } from "./api";
import { useToast } from "@/components/ui/use-toast";
import { getAllCargos, getTrips } from "../../../_api";
import { COLORS } from "@/lib/colors";
import { useSelectionContext } from "../Contexts";

export const UpdateTripNumber = ({
  currentTripNumber,
  isWH = false,
}: {
  currentTripNumber: number;
  isWH?: boolean;
}) => {
  const [selectedRows, setRowSelected] = useSelectionContext();
  // const [selectedWHRows, setWHRowSelected] = useWHSelectionContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCargos, setSelectedCargos] = useState<
    {
      number: number;
      isSelected: boolean;
    }[]
  >([]);
  // const [selectedWHCargos, setSelectedWHCargos] = useState<
  //   {
  //     number: number;
  //     isSelected: boolean;
  //   }[]
  // >([]);
  const [cargos, setCargos] = useState<CargoType[]>();
  const [selectedTrip, setSelectedTrip] = useState<number>();

  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["getAllCargos"],
    queryFn: async () => await getAllCargos(),
  });

  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ["getAllTrips"],
    queryFn: async () => await getTrips(),
  });

  useEffect(() => {
    if (
      selectedRows &&
      // selectedWHRows &&
      data
    ) {
      setSelectedCargos(selectedRows.filter((e) => e.isSelected));
      // setSelectedWHCargos(selectedWHRows.filter((e) => e.isSelected));
      setCargos(data);
    }
  }, [
    selectedRows,
    // selectedWHRows,
    data,
  ]);

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
      // setWHRowSelected([]);
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
      return weightCalc + volumeCalc > 6 ? <b> ПЕРЕПОЛНЕН</b> : <></>;
    }

    return weightCalc + volumeCalc <= 2
      ? `${COLORS.green}`
      : weightCalc + volumeCalc <= 4
        ? `${COLORS.yellow}`
        : weightCalc + volumeCalc <= 6
          ? `${COLORS.orange}`
          : `${COLORS.red}`;
  };
  const isMskTrip = (city_to: string) => {
    if (city_to === "Москва") return "О- ";
    // const isMskTrip = (trip: TripType) => {
    //   const week = weeksData?.filter((w) => w.id === Number(trip.week_id))[0];
    //   if (week?.table_type === "kz") return "О- ";
    //   return "";
  };
  if (!tripsData) return <Spinner />;
  return (
    <div className="">
      <Button
        color="warning"
        onPress={() => {
          onOpen();
        }}
      >
        Перенести выбранные грузы
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span>Перенести:</span>
                  {/* <div */}
                  {/* className={`grid grid-cols-${selectedCargos.length < 4 ? selectedCargos.length : "3"}`}
                  > */}
                  {/* {selectedCargos.map((cargo, index) => (
                      <span key={index}>
                        {cargo.number}
                        {index < selectedCargos.length - 1 && (
                          <span>,&nbsp;</span>
                        )}
                      </span>
                    ))}*/}
                  {/* </div> */}
                  {selectedCargos.length}

                  <span>груза из {currentTripNumber} рейса</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  aria-label="Выберите рейс"
                  label="Выберите рейс"
                  selectedKey={selectedTrip}
                  onSelectionChange={(e) => {
                    setSelectedTrip(e as number);
                  }}
                >
                  {tripsData
                    ?.filter(
                      (trip) =>
                        trip.trip_number !== currentTripNumber &&
                        trip.status !== "Прибыл"
                    )
                    .sort((a, b) => a.trip_number - b.trip_number)
                    .map((e) => (
                      <AutocompleteItem
                        key={e.id}
                        className="py-4"
                        textValue={`${e.trip_number} | ${e.driver.driver.split(" ")[0]} - ${e.driver.state_number} (${e.city_to.map((e) => e)})`}
                        value={e.trip_number}
                        style={{
                          border: ` 2px solid ${sumCargosColorForTrip(e, false)}`,
                        }}
                      >
                        <b>{`${e.trip_number}`}</b> |{" "}
                        <b>{isMskTrip(e.city_to[0])}</b>
                        {`${e.driver.driver.split(" ")[0]} - ${e.driver.state_number} (${e.city_to.map((e) => e)})`}
                        {sumCargosColorForTrip(e, true)}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
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
