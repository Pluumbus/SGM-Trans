"use client";
import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { TripCard } from "../TripCard";
import { useUser } from "@clerk/nextjs";
import { AddWeek } from "./AddWeek";
import { useQuery } from "@tanstack/react-query";
import { getWeeks } from "../../trip/_api";
import { useState, useEffect } from "react";
import { TripType } from "../TripCard/TripCard";

export const WeekCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => await getWeeks(),
  });

  const [groupedWeeks, setGroupedWeeks] = useState([]);

  useEffect(() => {
    if (data) {
      setGroupedWeeks(getFilteredWeeks(data));
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  const getFilteredWeeks = (data) => {
    const weekMap = {};

    data.forEach((cargo) => {
      const week = cargo.trips.weeks;
      if (!weekMap[week.id]) {
        weekMap[week.id] = { ...week, trips: [] };
      }
      const tripWithCargo = { ...cargo.trips, cargos: [cargo] };
      weekMap[week.id].trips.push(tripWithCargo);
    });

    // Combine cargos belonging to the same trip
    Object.values(weekMap).forEach((week: any) => {
      const tripMap = {};
      week.trips.forEach((trip: any) => {
        if (!tripMap[trip.id]) {
          tripMap[trip.id] = { ...trip, cargos: [] };
        }
        tripMap[trip.id].cargos.push(...trip.cargos);
      });
      week.trips = Object.values(tripMap);
    });

    return Object.values(weekMap);
  };

  return (
    <div>
      <AddWeek />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <div className="flex gap-4 w-full min-h-44">
        <Accordion selectionMode="multiple">
          {groupedWeeks.map((week, i) => (
            <AccordionItem
              key={i}
              aria-label={`Accordion ${i}`}
              title={`Week ${week.id}`}
              subtitle={<SummaryOfTrip week={week} />}
            >
              <TripCard trips={week.trips} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const SummaryOfTrip = ({ week }) => {
  const { user } = useUser();
  return (
    <div className="flex gap-2">
      <span>{week.trips.length} trips</span>
      <span>
        {week.trips.reduce((acc, trip) => acc + trip.cargos.length, 0)} cargos
      </span>
      <span>{new Date(week.created_at).toLocaleDateString()}</span>
      <span>{new Date(week.created_at).toLocaleTimeString()}</span>
      <span>{user?.username || ""}</span>
    </div>
  );
};
