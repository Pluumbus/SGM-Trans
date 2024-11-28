"use client";

import { useParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { getTripsByWeekId } from "../_api";
import { Checkbox, Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { CargoModal } from "@/app/(backend-logic)/workflow/_feature";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { TripTab } from "./_features/TripTab";
import { NextPage } from "next";
import { useLocalStorage } from "@/tool-kit/hooks";
import React from "react";
import { useRoleBasedSchema } from "@/components/RoleManagment/RoleBasedSchema";
import { WeekType } from "@/app/(backend-logic)/workflow/_feature/types";
import { CreateTripInsideWeek } from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import supabase from "@/utils/supabase/client";
import { TripInfoCard } from "./_features/TripInfoCard";
import { TripAndWeeksIdType } from "../_api/types";
import { TripInfoMscCard } from "./_features/TripInfoCard/TripMscInfoCard";
import { WorkflowBucket } from "./_features/WorkflowBucket/WorkflowBucket";

const Page: NextPage = () => {
  const { weekId, id } = useParams<{
    weekId: string;
    id: string;
  }>();

  const [selectedTabId, setSelectedTabId] = useState(id);
  const [tripsData, setTripsData] = useState<TripType[]>([]);
  const [week, setWeek] = useState<WeekType>();

  const { data: isOnlyMycargos, setToLocalStorage } = useLocalStorage({
    identifier: "show-only-my-cargos",
    initialData: false,
  });
  const { mutate, isPending } = useMutation<TripAndWeeksIdType[]>({
    mutationKey: [`trips-${weekId}`],
    mutationFn: async () => await getTripsByWeekId(weekId),
    onSuccess: (data) => {
      const processedData = data.map(({ weeks, ...main }) => {
        setWeek(weeks);
        return main;
      });
      setTripsData(processedData);
    },
  });

  useEffect(() => {
    mutate();
    setSelectedTabId(id);
  }, []);

  useEffect(() => {
    const cn = supabase
      .channel(`${weekId}-trips`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trips",
        },
        (payload) => {
          const updatedTrip = payload.new as TripType;

          if (payload.eventType == "INSERT")
            setTripsData((prev) => [...prev, updatedTrip]);
          else
            setTripsData((prev) => {
              const updatedTrips = prev.map((trip) =>
                trip.id === updatedTrip.id ? updatedTrip : trip
              );
              return updatedTrips;
            });
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  const { isOpen, onOpenChange } = useDisclosure();

  const columns = useMemo(() => useRoleBasedSchema(), []);

  const handleCargosUpdate = (cities: string[]) => {
    const uniqueData = Array.from(new Set(cities));

    const mainCity = tripsData.filter(
      (trip) => trip.trip_number === Number(selectedTabId)
    )[0].city_to[0];

    const newCities =
      uniqueData.length <= 5 ? uniqueData.slice(0, 3) : uniqueData.slice(0, 4);

    newCities.unshift(mainCity);

    const newCurrentTripCities = Array.from(
      new Set(
        (tripsData.filter(
          (trip) => trip.trip_number === Number(selectedTabId)
        )[0].city_to = newCities)
      )
    );

    const newTripsData = tripsData.map((trip) =>
      trip.id === Number(selectedTabId)
        ? { ...trip, city_to: newCurrentTripCities }
        : trip
    ) as TripType[];

    setTripsData(newTripsData);
  };

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex justify-between ">
        <TripInfoCard
          onOpenChange={onOpenChange}
          selectedTabId={selectedTabId}
          tripsData={tripsData}
        />
        <TripInfoMscCard selectedTabId={selectedTabId} tripsData={tripsData} />
        <WorkflowBucket />
      </div>
      <div className="flex flex-col ">
        <div className="flex flex-col justify-center items-center mb-2">
          <span className="text-xl">Рейсы недели №{week?.week_number}</span>
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
          className="flex justify-center "
          aria-label="Trips"
          defaultSelectedKey={selectedTabId}
          onSelectionChange={(key) => setSelectedTabId(key as string)}
        >
          {tripsData
            .sort((a, b) => a.id - b.id)
            .map((trip) => (
              <Tab
                key={trip.trip_number}
                className="h-auto"
                title={
                  <div className="flex flex-col items-center text-sm space-y-1">
                    <span className="text-gray-500 truncate">
                      {trip.driver.state_number}
                    </span>
                    <span className="text-gray-500 truncate">
                      {trip.status}
                    </span>
                    <span className="font-bold truncate">
                      {trip.trip_number}
                    </span>
                    <span className="text-gray-500 truncate"></span>
                    <TabTitle city_to={trip.city_to} />
                  </div>
                }
              >
                <TripTab
                  tripid={trip.trip_number}
                  columns={columns}
                  isOnlyMycargos={isOnlyMycargos}
                  onCargosUpdate={(cities) => handleCargosUpdate(cities)}
                />
              </Tab>
            ))}
          <Tab isDisabled>
            <CreateTripInsideWeek weekId={weekId} inTrip={true} />
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

const TabTitle = ({ city_to }: { city_to: string[] }) => {
  return city_to.map((city, index) => (
    <span key={index}>
      {city.slice(0, city.includes("-") || city.length <= 5 ? 3 : 4)}
      {city && (index < city_to.length - 1 ? "., " : ".")}
    </span>
  ));
};

export default Page;
