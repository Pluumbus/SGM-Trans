"use client";

import { useParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getTripsByWeekId } from "../_api";
import {
  Card,
  CardBody,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { TripTab } from "./_features/TripTab";
import { NextPage } from "next";

import { useLocalStorage } from "@/tool-kit/hooks";

import React from "react";

import RoleBasedWrapper from "@/components/roles/RoleBasedWrapper";
import { useRoleBasedSchema } from "@/components/roles/RoleBasedSchema";
import { WeekType } from "@/app/workflow/_feature/types";
import { Timer } from "@/components/Timer/Timer";
import { CreateTripInsideWeek } from "@/app/workflow/_feature/WeekCard/WeekCard";
import { getDayOfWeek } from "./_helpers";
import supabase from "@/utils/supabase/client";
import { TripInfoCard } from "./_features/TripInfoCard";
import { TripAndWeeksIdType } from "../types";

const Page: NextPage = () => {
  const { weekId, id } = useParams<{
    weekId: string;
    id: string;
  }>();

  const [selectedTabId, setSelectedTabId] = useState(id);
  const [tripsData, setTripsData] = useState<TripAndWeeksIdType[]>([]);
  const { data: isOnlyMycargos, setToLocalStorage } = useLocalStorage({
    identifier: "show-only-my-cargos",
    initialData: false,
  });

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
          const updatedTrip = payload.new as TripType & { weeks: WeekType };

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

  const { mutate, isPending } = useMutation<TripAndWeeksIdType[]>({
    mutationKey: [`trips-${weekId}`],
    mutationFn: async () => await getTripsByWeekId(weekId),
    onSuccess: (data) => {
      setTripsData(data);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  const { isOpen, onOpenChange } = useDisclosure();

  const columns = useMemo(() => useRoleBasedSchema(), []);

  const handleSelectTab = (key) => {
    setSelectedTabId(key);
  };

  if (isPending) {
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

export default Page;
