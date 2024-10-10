import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  DateValue,
} from "@nextui-org/react";

import { toast } from "@/components/ui/use-toast";

import supabase from "@/utils/supabase/client";
import { ReactNode, useEffect, useState } from "react";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { updateTripStatus } from "../../../_api/requests";
import { useMutation } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";

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
  const [isButtonChange, setIsButtonChange] = useState(false);
  const [ignoreMutation, setIgnoreMutation] = useState(true);

  const { mutate: setStatusMutation } = useMutation({
    mutationKey: ["SetTripStatus"],
    mutationFn: async () => await updateTripStatus(statusVal, selectedTabId),
    onSuccess() {
      setIsButtonChange(false);
      toast({
        title: "Статус рейса успешно обновлён",
      });
    },
  });

  // const { mutate, isPending } = useMutation({
  //   mutationKey: [`trip-${currentTripData.id}-status`],
  //   mutationFn: async () => await updateTripStatus(statusVal, selectedTabId),
  //   onSuccess() {

  //   },
  // });

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

  useEffect(() => {
    const currentTrip = tripsData.find(
      (item) => item.id === Number(selectedTabId)
    );
    setCurrentTripData(currentTrip);
    setStatusVal(currentTrip?.status);
    setIgnoreMutation(true);
  }, [selectedTabId, tripsData]);

  useEffect(() => {
    if (ignoreMutation) return;

    if (statusVal && statusVal !== "Выбрать дату") {
      setStatusMutation();
    }
  }, [statusVal, ignoreMutation, setStatusMutation]);

  useEffect(() => {
    const cn = supabase
      .channel(`trip${selectedTabId}-status`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trips",
        },
        (payload) => {
          setStatusVal((payload.new as TripType).status);
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span>Номер рейса:</span>
        <b>{selectedTabId}</b>
      </div>
      <div className="flex justify-between">
        <span>Водитель: </span>
        <b className="items-end">{currentTripData?.driver} </b>
      </div>

      <div className="flex justify-between">
        Статус:{" "}
        {isButtonChange ? (
          <div>
            {statusVal === "Выбрать дату" ? (
              <DatePicker
                aria-label="Выбрать дату"
                onChange={handleSetDateChange}
              />
            ) : (
              <Autocomplete
                aria-label="AutoStatus"
                variant="underlined"
                onInputChange={handleSetStatus}
                inputValue={statusVal}
              >
                {["Выбрать дату", "В пути"].map((stat: string) => (
                  <AutocompleteItem key={stat}>{stat}</AutocompleteItem>
                ))}
              </Autocomplete>
            )}
          </div>
        ) : (
          <>
            <b className="mr-4">{statusVal}</b>
            <Button
              isIconOnly
              size="sm"
              color="default"
              onClick={() => {
                setIsButtonChange((prev) => !prev);
              }}
            >
              <IoMdSettings />
            </Button>
          </>
        )}
      </div>

      <div>
        <Button color="success" onClick={onOpenChange}>
          Добавить груз
        </Button>
      </div>
    </div>
  );
};
