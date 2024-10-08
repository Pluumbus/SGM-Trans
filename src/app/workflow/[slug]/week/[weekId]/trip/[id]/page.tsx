"use client";

import { useParams } from "next/navigation";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

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
              title={
                <>
                  <Tooltip
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">
                          {trip.status}
                        </div>
                        <div className="text-tiny">{trip.city_to}</div>
                      </div>
                    }
                  >
                    {trip.id.toString()}
                  </Tooltip>
                  {/* <Tooltip
                    content={tabTitles[trip.id]?.join(
                      " " + trip.status.slice(0, 5)
                    )}
                  >
                    {trip.id.toString()}
                  </Tooltip> */}
                </>
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
          console.log((payload.new as TripType).status);
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
        <b className="items-end">{currentTripData?.driver}</b>
      </div>

      <div className="flex justify-between">
        Статус:{" "}
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
            {["Выбрать дату", "В пути" ].map(
              (stat: string) => (
                <AutocompleteItem key={stat}>{stat}</AutocompleteItem>
              )
            )}
          </Autocomplete>
        )}
        {/* ) : (
          <b>{statusVal}</b>
        )} */}
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
