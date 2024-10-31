"use client";

import { useParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { getTripsByWeekId } from "../_api";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/(backend-logic)/workflow/_feature";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { TripTab } from "./_features/TripTab";
import { NextPage } from "next";

import { useLocalStorage } from "@/tool-kit/hooks";

import React from "react";

import RoleBasedWrapper from "@/components/roles/RoleBasedWrapper";
import { useRoleBasedSchema } from "@/components/roles/RoleBasedSchema";
import { WeekType } from "@/app/(backend-logic)/workflow/_feature/types";
import { Timer } from "@/components/Timer/Timer";
import { CreateTripInsideWeek } from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import supabase from "@/utils/supabase/client";
import { TripInfoCard } from "./_features/TripInfoCard";
import { TripAndWeeksIdType } from "../_api/types";
import { TripInfoMscCard } from "./_features/TripInfoCard/TripMscInfoCard";

const Page: NextPage = () => {
  const { slug, weekId, id } = useParams<{
    slug: string;
    weekId: string;
    id: string;
  }>();

  const [selectedTabId, setSelectedTabId] = useState(id);
  const [tripsData, setTripsData] = useState<TripType[]>([]);
  const [week, setWeek] = useState<WeekType>();

  const [tabTitles, setTabTitles] = useState<{ [key: string]: string[] }>({});

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

  const handleCargosUpdate = (tripId: string, cities: string[]) => {
    const uniqueData = Array.from(new Set(cities));
    // setTabTitles((prevTitles) => ({
    //   ...prevTitles,
    //   [tripId]: uniqueData,
    // }));
    const newCities =
      uniqueData.length <= 5 ? uniqueData.slice(0, 3) : uniqueData.slice(0, 4);
    const newCurrentTripCities = Array.from(
      new Set(
        tripsData
          .filter((trip) => trip.id === Number(selectedTabId))[0]
          .city_to.concat(newCities)
      )
    );

    // const newTripsData = tripsData.map((trip) =>
    //   trip.id === Number(selectedTabId) ? newCurrentTripCities : trip.city_to
    // );
    const newTripsData = tripsData.map((trip) =>
      trip.id === Number(selectedTabId)
        ? { ...trip, city_to: newCurrentTripCities }
        : trip
    ) as TripType[];
    // .map((trip) => trip.city_to.concat(uniqueData));
    // setTabTitles({ [tripId]: uniqueData });
    setTripsData(newTripsData);
    console.log(newTripsData, "uniqData", uniqueData);
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
                key={trip.id}
                className="h-auto"
                title={
                  <div className="flex flex-col items-center text-sm space-y-1">
                    <span className="text-gray-500 truncate">
                      {trip.status}
                    </span>
                    <span className="font-bold truncate">{trip.id}</span>
                    <span className="text-gray-500 truncate">
                      {trip.city_to.map((city, index) => (
                        <div key={index}>
                          {city.slice(
                            0,
                            city.includes("-") || city.length <= 5 ? 3 : 4
                          )}
                          {city &&
                            (index < trip.city_to.length - 1 ? ", " : ".")}
                        </div>
                      ))}
                    </span>
                  </div>
                }
              >
                <TripTab
                  currentTrip={trip}
                  trips={tripsData}
                  columns={columns}
                  isOnlyMycargos={isOnlyMycargos}
                  onCargosUpdate={(cities) =>
                    handleCargosUpdate(trip?.id.toString(), cities)
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

export default Page;
