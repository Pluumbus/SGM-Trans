"use client";
import { getTrailers } from "@/lib/references/drivers/feature/api";
import { TrailersType } from "@/lib/references/drivers/feature/types";
import {
  useDisclosure,
  Spinner,
  Card,
  Button,
  Listbox,
  ListboxItem,
  Input,
  CardHeader,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import trailerImg from "@/app/_imgs/trailer-icon.png";

import {
  AddTruckObjectsModal,
  ModalTitleItems,
  useDeleteObject,
} from "./Modals/AddTruckObjectsModal";
import Image from "next/image";
import supabase from "@/utils/supabase/client";

export const TrailersList = () => {
  const { data: trailersData, isLoading } = useQuery({
    queryKey: ["getTrailers"],
    queryFn: async () => getTrailers(),
  });
  const [trailers, setTrailers] = useState<TrailersType[]>(trailersData || []);
  const [tempTrailers, setTempTrailers] = useState<TrailersType[]>(trailers);
  const { confirmDeleteObject } = useDeleteObject();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    setTrailers(trailersData);
    setTempTrailers(trailersData);
  }, [trailersData]);

  useEffect(() => {
    const cn = supabase
      .channel(`trailers-list/cars&drivers`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trailers",
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setTrailers((prev) => {
              return prev.filter((d) => d.id !== payload.old.id);
            });
            setTempTrailers((prev) => {
              return prev.filter((d) => d.id !== payload.old.id);
            });
          } else {
            setTrailers((prev) => [...prev, payload.new as TrailersType]);
            setTempTrailers((prev) => [...prev, payload.new as TrailersType]);
          }
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  const handleFilterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTrailers(
      trailers.filter((c) =>
        c.state_number.includes(e.target.value.toUpperCase())
      )
    );
  };

  if (isLoading) return <Spinner />;
  return (
    <div>
      <Card className="w-full">
        <CardHeader className="flex justify-center">
          <Image src={trailerImg} alt="trailer-icon" width={50} />
        </CardHeader>
        <Input
          variant="bordered"
          placeholder="Поиск по номеру"
          onChange={handleFilterData}
        />
        <Button variant="faded" onPress={onOpen}>
          Добавить
        </Button>
        <Listbox aria-label="drivers-list">
          {tempTrailers?.map((tr) => (
            <ListboxItem
              key={tr.id}
              className="border-b"
              textValue={tr.trailer}
              onClick={() =>
                confirmDeleteObject(
                  tr.id,
                  "trailers",
                  tr.trailer + " | " + tr.state_number
                )
              }
            >
              {tr.trailer + " | " + tr.state_number}
            </ListboxItem>
          ))}
        </Listbox>
      </Card>
      <AddTruckObjectsModal
        isOpen={isOpen}
        modalTitle={ModalTitleItems[2]}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
