"use client";
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { TripCard } from "../TripCard";
import { useUser } from "@clerk/nextjs";

export const WeekCard = () => {
  const tmp = Array.from({ length: 10 }, (_, i) => i);
  return (
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
  );
};

const Subtitle = () => {
  const { user } = useUser();
  return (
    <div className=" flex gap-2">
      <span>20 рейсов</span>
      <span>218 грузов</span>
      <span>{new Date().toLocaleDateString()}</span>
      <span>{new Date().toLocaleTimeString()}</span>
      <span>{user?.username || ""}</span>
    </div>
  );
};
