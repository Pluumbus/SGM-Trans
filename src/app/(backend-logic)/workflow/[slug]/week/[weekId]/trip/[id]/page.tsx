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
      setSelectedTabId(
        data.find((e) => e.trip_number == Number(id)).id.toString()
      );

      setTripsData(processedData);
    },
  });

  useEffect(() => {
    mutate();
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

  const handleCargosUpdate = (cities: string[], tripid: number) => {
    const uniqueData = Array.from(new Set(cities));

    const mainCity = tripsData.filter((trip) => trip.id === tripid)[0]
      .city_to[0];

    const newCities =
      uniqueData.length <= 5 ? uniqueData.slice(0, 3) : uniqueData.slice(0, 4);

    newCities.unshift(mainCity);

    const newCurrentTripCities = Array.from(
      new Set(
        (tripsData.filter((trip) => trip.id === tripid)[0].city_to = newCities)
      )
    );
    const newTripsData = tripsData.map((trip) =>
      trip.id === tripid ? { ...trip, city_to: newCurrentTripCities } : trip
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
          className="flex justify-center"
          aria-label="Trips"
          defaultSelectedKey={selectedTabId}
          onSelectionChange={(key) => setSelectedTabId(key as string)}
        >
          {tripsData
            .sort((a, b) => a.id - b.id)
            .map((trip) => (
              <Tab
                key={trip.id}
                className="!min-h-full !h-full"
                title={<TabTitle trip={trip} />}
              >
                <TripTab
                  trip={trip}
                  columns={columns}
                  isOnlyMycargos={isOnlyMycargos}
                  onCargosUpdate={(cities) =>
                    handleCargosUpdate(cities, trip.id)
                  }
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

const TabTitle = ({ trip }: { trip: TripType }) => {
  return (
    <div className="grid grid-rows-2 min-w-[4.20rem]">
      <div className="grid grid-rows-3 !min-h-full !h-full ">
        <div className="text-gray-500 truncate grid-rows-1">
          <span>{trip.status}</span>
        </div>
        <div className="text-gray-500 truncate grid-rows-1 break-words">
          <span>{trip.driver?.state_number}</span>
        </div>
        <div className="font-bold truncate grid-rows-1">
          <span>{trip.trip_number}</span>
        </div>
      </div>
      <TabCities city_to={trip.city_to} />
    </div>
  );
};

const TabCities = ({ city_to }: { city_to: string[] }) => {
  return (
    <div className="flex flex-col">
      {city_to.map((city, index) => (
        <span key={index}>
          {city.slice(0, city.includes("-") || city.length <= 5 ? 3 : 4)}
          {city && (index < city_to.length - 1 ? "., " : ".")}
        </span>
      ))}
    </div>
  );
};

export default Page;
