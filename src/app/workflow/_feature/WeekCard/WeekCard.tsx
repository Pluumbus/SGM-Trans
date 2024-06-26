"use client";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { TripCard } from "../TripCard";
import { useUser } from "@clerk/nextjs";
import { AddWeek } from "./AddWeek";

export const WeekCard = () => {
  const tmp = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div>
      <AddWeek />
      <div className="flex gap-4 w-full min-h-44">
        <Accordion selectionMode="multiple">
          {tmp.map((e) => (
            <AccordionItem
              key={e}
              aria-label={`Accordion ${e}`}
              title={`№ ${e + 1}`}
              subtitle={<Subtitle />}
            >
              <TripCard />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const Subtitle = () => {
  const { user } = useUser();
  return (
    <div className=" flex gap-2">
      <span>20 рейсов</span>
      <span>218 грузов</span>
      <span>{"25.06.2024"}</span>
      <span>{"13:59"}</span>
      <span>{user?.username || ""}</span>
    </div>
  );
};
