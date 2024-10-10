"use client";

import { useParams } from "next/navigation";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";
import { getTripsByWeekId } from "../_api";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Checkbox,
  DatePicker,
  DateValue,
  Spinner,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { TripTab } from "./_features/TripTab";
import { NextPage } from "next";

import { useLocalStorage } from "@/tool-kit/hooks";

import { checkRole } from "@/components/roles/useRole";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { updateTripStatus } from "../_api/requests";
import RoleBasedWrapper from "@/components/roles/RoleBasedWrapper";
import { useRoleBasedSchema } from "@/components/roles/RoleBasedSchema";
import { WeekType } from "@/app/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { Timer } from "@/components/Timer/Timer";
import { CreateTripInsideWeek } from "@/app/workflow/_feature/WeekCard/WeekCard";

//DONT DELETE COMMENTS

const Page: NextPage = () => {
  const { weekId, id } = useParams<{
    weekId: string;
    id: string;
  }>();

  const [selectedTabId, setSelectedTabId] = useState(id);

  // const [tabTitles, setTabTitles] = useState<{ [key: string]: string[] }>({});
  // const handleCargosUpdate = (tripId: string, cities: string[]) => {
  //   console.log("tabTitles", tabTitles, "OtherData", tripId, cities);
  //   const uniqueData = Array.from(new Set(cities));

  //   setTabTitles((prevTitles) => ({
  //     ...prevTitles,
  //     [tripId]: uniqueData,
  //   }));
  // };
  const { data: isOnlyMycargos, setToLocalStorage } = useLocalStorage({
    identifier: "show-only-my-cargos",
    initialData: false,
  });

  const { data: tripsData, isLoading } = useQuery<
    (TripType & { weeks: WeekType })[]
  >({
    queryKey: ["getTrips"],
    queryFn: async () => await getTripsByWeekId(weekId),
  });

  const { isOpen, onOpenChange } = useDisclosure();

  const columns = useMemo(() => useRoleBasedSchema(), []);

  const handleSelectTab = (key) => {
    setSelectedTabId(key);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const getDayOfWeek = (dateStr) => {
    const [day, month, year] = dateStr.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    const dayIndex = date.getDay();
    const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПН", "СБ"];
    return daysOfWeek[dayIndex];
  };

  return (
    <div>
      <div className="flex justify-between">
        <Card className="bg-gray-200 w-72">
          <CardBody>
            <TripInfoCard
              onOpenChange={onOpenChange}
              selectedTabId={selectedTabId}
              tripsData={tripsData}
            />
          </CardBody>
        </Card>
        <RoleBasedWrapper allowedRoles={["Админ", "Логист Дистант"]}>
          <Timer />
        </RoleBasedWrapper>
      </div>
      <div className="flex flex-col ">
        <div className="flex flex-col justify-center items-center mb-2">
          <span className="text-xl">
            Рейсы недели №{tripsData[0]?.weeks?.week_number}
          </span>
          <Checkbox
            isSelected={isOnlyMycargos}
            onChange={() => {
              setToLocalStorage(!isOnlyMycargos);
            }}
          >
            Показать только мои грузы
          </Checkbox>
        </div>

        <Tabs
          className="flex justify-center"
          aria-label="Trips"
          defaultSelectedKey={selectedTabId}
          onSelectionChange={(key) => handleSelectTab(key)}
        >
          {tripsData.map((trip) => (
            <Tab
              className="h-20"
              title={
                <div className="flex flex-col items-center text-sm space-y-1">
                  <span className="text-gray-500 truncate">
                    {trip.status !== "В пути"
                      ? getDayOfWeek(trip.status)
                      : trip.status}
                  </span>
                  <span className="font-bold truncate">{trip.id}</span>

                  <span className="text-gray-500 truncate">
                    {trip.city_to.map((city, index) => (
                      <>
                        {city.length <= 5 ? city.slice(0, 3) : city.slice(0, 4)}
                        {index < trip.city_to.length - 1 ? ", " : "."}
                      </>
                    ))}
                  </span>
                </div>
              }
              key={trip.id}
            >
              <TripTab
                currentTrip={trip}
                trips={tripsData}
                columns={columns}
                isOnlyMycargos={isOnlyMycargos}
                // onCargosUpdate={(cities) =>
                //   handleCargosUpdate(trip?.id.toString(), cities)
                // }
              />
            </Tab>
          ))}
          <Tab
            className="flex items-center justify-center h-20 bg-opacity-0"
            isDisabled={true}
          >
            <span className="text-gray-500 cursor-pointer">
              <CreateTripInsideWeek weekId={weekId} inTrip={true} />
            </span>
          </Tab>
        </Tabs>
      </div>
      <CargoModal
        isOpenCargo={isOpen}
        onOpenChangeCargo={onOpenChange}
        trip_id={Number(selectedTabId)}
      />
    </div>
  );
};

const TripInfoCard = ({
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

export default Page;
