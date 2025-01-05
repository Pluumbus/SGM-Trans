import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useReqItem } from "./Context";
import { useQuery } from "@tanstack/react-query";
import { getTrips } from "../../workflow/[slug]/week/[weekId]/trip/_api";
import { AdjustedRequestDTO } from "../types";

export const SelectTripModal = ({
  disclosure,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
}) => {
  const {
    disclosure: cargoDisclosure,
    selectedReq,
    setSelectedReq,
  } = useReqItem();
  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ["getAllTrips"],
    queryFn: async () => await getTrips(),
  });
  return (
    <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <ModalContent>
        <ModalHeader>
          Выберите рейс в который хотите добавить этот груз
        </ModalHeader>
        <Divider />
        <ModalBody>
          <Autocomplete
            aria-label="Выберите рейс"
            label="Выберите рейс"
            isLoading={tripsLoading}
            selectedKey={(selectedReq as AdjustedRequestDTO).trip_id}
            onSelectionChange={(e) => {
              setSelectedReq((prev) => ({ ...prev, trip_id: e as number }));
            }}
          >
            {tripsData
              ?.filter((trip) => trip.status !== "Прибыл")
              .sort((a, b) => a.trip_number - b.trip_number)
              .map((e) => (
                <AutocompleteItem
                  key={e.id}
                  textValue={`${e.trip_number} | ${e.driver.driver.split(" ")[0]} - ${e.driver.state_number} (${e.city_to.map((e) => e)})`}
                  value={e.id}
                  style={{
                    border: `2px solid`,
                  }}
                >
                  <b>{`${e.trip_number}`}</b> |{" "}
                  {`${e.driver.driver.split(" ")[0]} - ${e.driver.state_number} (${e.city_to.map((e) => e)})`}
                </AutocompleteItem>
              ))}
          </Autocomplete>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button
            onPress={() => {
              disclosure.onOpenChange();
            }}
            variant="light"
            color="danger"
          >
            Отмена
          </Button>
          <Button
            isDisabled={!(selectedReq as AdjustedRequestDTO).trip_id}
            onPress={() => {
              cargoDisclosure.onOpenChange();
            }}
            variant="flat"
            color="success"
          >
            Далее
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
