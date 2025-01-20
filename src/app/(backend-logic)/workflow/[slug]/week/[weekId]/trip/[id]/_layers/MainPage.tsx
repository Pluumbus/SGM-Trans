"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Checkbox,
  Divider,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/(backend-logic)/workflow/_feature";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { NextPage } from "next";

import React from "react";
import { useRoleBasedSchema } from "@/components/RoleManagment/RoleBasedSchema";
import {
  CargoType,
  WeekType,
} from "@/app/(backend-logic)/workflow/_feature/types";
import { CreateTripInsideWeek } from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import supabase from "@/utils/supabase/client";
import { getSchema } from "@/utils/supabase/getSchema";
import { TripAndWeeksIdType } from "../../_api/types";
import {
  CargosVisibilityProvider,
  SelectionProvider,
  useCargosVisibility,
} from "../_features/Contexts";
import { TotalStats } from "../_features/Statistics/TotalStats";
import { TripInfoCard } from "../_features/TripInfoCard";
import { WorkflowBucket } from "../_features/WorkflowBucket/WorkflowBucket";
import { getTripsByWeekId } from "../../_api";
import { TripTab } from "../_features/TripTab";
import { UpdateModal } from "../_features/UpdateCargo/Modal";
import { getDayOfWeek } from "../_helpers";

export const MainPage: NextPage = () => {
  const { weekId, id } = useParams<{
    weekId: string;
    id: string;
  }>();

  const [selectedTabId, setSelectedTabId] = useState(id);
  const [tripsData, setTripsData] = useState<TripType[]>([]);
  const [cargos, setCargos] = useState<CargoType[]>();
  const [week, setWeek] = useState<WeekType>();

  const [isOnlyMycargos, setToLocalStorage] = useState(false);
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
          schema: getSchema(),
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

  const disclosure = useDisclosure();
  const { isOpen, onOpenChange } = disclosure;

  const columns = useRoleBasedSchema();

  const handleCargosUpdate = (
    cities: string[],
    tripid: number,
    cargos: CargoType[]
  ) => {
    setCargos(cargos);
    const uniqueData = Array.from(new Set(cities));

    const mainCity = tripsData.filter((trip) => trip.id === tripid)[0]
      .city_to[0];

    // const newCities =
    //   uniqueData.length <= 5 ? uniqueData.slice(0, 3) : uniqueData.slice(0, 4);

    uniqueData.unshift(mainCity);

    const newCurrentTripCities = Array.from(
      new Set(
        (tripsData.filter((trip) => trip.id === tripid)[0].city_to = uniqueData)
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
    <CargosVisibilityProvider>
      <SelectionProvider>
        {/* <WHSelectionProvider> */}
        <div>
          <div className="flex justify-between ">
            <TripInfoCard
              onOpenChange={onOpenChange}
              selectedTabId={selectedTabId}
              tripsData={tripsData}
            />
            <div className="mr-[16rem]">
              <TotalStats cargos={cargos} onTop={true} />
            </div>
            <WorkflowBucket />
          </div>
          <div className="flex flex-col ">
            <TabVisibility week={week} />

            <Tabs
              className="flex justify-center"
              aria-label="Trips"
              defaultSelectedKey={selectedTabId}
              onSelectionChange={(key) => setSelectedTabId(key as string)}
            >
              {tripsData
                .sort((a, b) => a.trip_number - b.trip_number)
                .map((trip) => (
                  <Tab
                    key={trip.id}
                    className="!min-h-full !h-full"
                    title={<TabTitle trip={trip} />}
                  >
                    <TripTab
                      trip={trip}
                      columns={columns}
                      onCargosUpdate={(cities, cargos) =>
                        handleCargosUpdate(cities, trip.id, cargos)
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
            disclosure={disclosure}
            trip_id={Number(selectedTabId)}
            prefilledData={null}
          />
          <UpdateModal />
        </div>
        {/* </WHSelectionProvider> */}
      </SelectionProvider>
    </CargosVisibilityProvider>
  );
};

const TabVisibility = ({ week }: { week: WeekType }) => {
  const { isOnlyMyCargos, setIsOnlyMyCargos } = useCargosVisibility();

  return (
    <div className="flex flex-col justify-center items-center mb-2">
      <span className="text-xl">Рейсы недели №{week?.week_number}</span>
      <Checkbox
        isSelected={isOnlyMyCargos}
        onValueChange={(e) => {
          setIsOnlyMyCargos(e);
        }}
      >
        Показать только мои грузы
      </Checkbox>
    </div>
  );
};

const TabTitle = ({ trip }: { trip: TripType }) => {
  return (
    <div className="grid grid-rows-2 min-w-[4.20rem]">
      <div className="grid grid-rows-3 !min-h-full !h-full ">
        <div className="grid-rows-1">
          <span>{trip.status}</span>
        </div>
        <div className="font-bold truncate grid-rows-1">
          <span>{trip.trip_number}</span>
        </div>

        <div className=" grid-rows-1 break-words">
          <span>{trip.driver.driver.split(" ")[0]}</span>
        </div>

        <div className=" grid-rows-1 break-words">
          <span>{trip.driver.state_number}</span>
        </div>
        <div className=" grid-rows-1 break-words">
          <span>{trip.date_in?.slice(0, 5)}</span>
        </div>
        <Divider />
      </div>
      <TabCities city_to={trip.city_to} />
    </div>
  );
};

const TabCities = ({ city_to }: { city_to: string[] }) => {
  return (
    <div className="flex flex-col">
      {city_to?.map((city, index) => (
        <span className="text-gray-500 truncate" key={index}>
          {city?.slice(0, city.includes("-") || city.length <= 5 ? 3 : 4)}
          {city && (index < city_to.length - 1 ? "., " : ".")}
        </span>
      ))}
    </div>
  );
};
