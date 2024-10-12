"use client";
import {
  Button,
  DatePicker,
  DateValue,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";

import { toast } from "@/components/ui/use-toast";

import { ReactNode, useEffect, useState } from "react";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { updateTripStatus } from "../../../_api/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";
import { getUserById } from "../../../_api";

export const TripInfoCard = ({
  selectedTabId,
  tripsData,
  onOpenChange,
}: {
  selectedTabId: ReactNode;
  tripsData: TripType[];
  onOpenChange: () => void;
}) => {
  const [currentTripData, setCurrentTripData] = useState<TripType>();
  const [statusVal, setStatusVal] = useState<string | undefined>();
  const [ignoreMutation, setIgnoreMutation] = useState(true);
  const { mutate: setStatusMutation } = useMutation({
    mutationKey: ["SetTripStatus"],
    mutationFn: async () => await updateTripStatus(statusVal, selectedTabId),
    onSuccess() {
      toast({
        title: "Статус рейса успешно обновлён",
      });
    },
  });

  useEffect(() => {
    const currentTrip = tripsData.find(
      (item) => item.id === Number(selectedTabId)
    );
    setCurrentTripData(currentTrip);
    setStatusVal(currentTrip?.status);
    setIgnoreMutation(true);
    refetch();
  }, [selectedTabId, tripsData]);

  useEffect(() => {
    if (ignoreMutation) return;

    if (statusVal && statusVal !== "Выбрать дату") {
      setStatusMutation();
    }
  }, [statusVal, ignoreMutation, setStatusMutation]);

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: [`GetResponsibleUsersNames`],
    queryFn: async () => {
      const namesList = await Promise.all(
        tripsData.map(async (trip) => {
          const fullName = await getUserById(trip.user_id);
          const tripId = trip.id;
          return { tripId, fullName };
        })
      );
      return namesList;
    },
  });
  const handleSetDateChange = (date: DateValue | null) => {
    const dateStr = new Date(
      date.year,
      date.month - 1,
      date.day
    ).toLocaleDateString();
    setStatusVal(dateStr);
    setIgnoreMutation(false);
  };

  const handleSetStatus = (val: string) => {
    setStatusVal(val);
    setIgnoreMutation(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span>Ответственный:</span>
        <b>
          {isLoading ? (
            <Spinner />
          ) : (
            data?.filter((user) => user.tripId === currentTripData?.id)[0]
              ?.fullName.firstName
          )}
        </b>
      </div>
      <div className="flex justify-between">
        <span>Номер рейса:</span>
        <b>{selectedTabId}</b>
      </div>
      <div className="flex justify-between">
        <span>Водитель: </span>
        <b className="items-end">{currentTripData?.driver} </b>
      </div>

      <div className="flex justify-between">
        Статус:
        <>
          {statusVal === "Выбрать дату" ? (
            <DatePicker
              aria-label="Выбрать дату"
              onChange={handleSetDateChange}
            />
          ) : (
            <>
              <b>{statusVal}</b>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" color="default">
                    <IoMdSettings />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {["Выбрать дату", "В пути"].map((stat: string) => (
                    <DropdownItem
                      key={stat}
                      onClick={() => handleSetStatus(stat)}
                    >
                      {stat}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </>
          )}
        </>
      </div>

      <div>
        <Button color="success" onClick={onOpenChange}>
          Добавить груз
        </Button>
      </div>
    </div>
  );
};
