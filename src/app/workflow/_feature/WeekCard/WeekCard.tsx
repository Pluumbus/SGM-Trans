"use client";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { TripCard } from "../TripCard";
import { useUser } from "@clerk/nextjs";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import supabase from "@/utils/supabase/client";
import { AddWeek } from "./Modals/AddWeek";
import { useToast } from "@/components/ui/use-toast";
import { WeekType } from "../types";
import { Cities, Drivers } from "@/lib/references";
import { getJustWeeks } from "../../[slug]/week/[weekId]/trip/_api";

export const WeekCard = () => {
  const { data: dataWeeks, isLoading: isLoadingWeeks } = useQuery({
    queryKey: ["weeks"],
    queryFn: async () => await getJustWeeks(),
  });

  const [weeks, setWeeks] = useState<WeekType[]>([]);

  useEffect(() => {
    const cn = supabase
      .channel("view-weeks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weeks" },
        (payload) => {
          setWeeks((prev) => [...prev, payload.new as WeekType]);
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (dataWeeks) {
      setWeeks(dataWeeks);
    }
  }, [dataWeeks]);

  if (isLoadingWeeks) {
    return <Spinner />;
  }

  return (
    <div>
      <AddWeek />
      <div className="flex gap-4 w-full min-h-44">
        <Accordion selectionMode="multiple">
          {weeks.map((week, i) => (
            <AccordionItem
              key={i + 1}
              aria-label={`Accordion ${i}`}
              title={`Неделя ${i + 1}`}
              // subtitle={<SummaryOfTrip week={week} />}
            >
              <CreateTripInsideWeek week={week} />
              <TripCard weekId={week.id.toString()} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const CreateTripInsideWeek = ({ week }) => {
  const { toast } = useToast();
  const { isOpen: isOpenTrip, onOpenChange: onOpenChangeTrip } =
    useDisclosure();

  const [formState, setFormState] = useState<{
    city_from: any;
    city_to: any;
    driver: any;
  }>({
    city_from: "",
    city_to: "",
    driver: "",
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      await supabase.from("trips").insert({
        city_from: formState.city_from,
        city_to: formState.city_to,
        driver: formState.driver,
        week_id: week.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно создали путь",
      });
      onOpenChangeTrip();
    },
    onError: () => {
      toast({
        title: "Произошла ошибка",
        description: "Попробуйте позже",
      });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div>
      <Button
        onClick={() => {
          onOpenChangeTrip();
        }}
      >
        Добавить путь
      </Button>

      <Modal isOpen={isOpenTrip} onOpenChange={onOpenChangeTrip} size="2xl">
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>Добавить путь</ModalHeader>
            <Divider />
            <ModalBody>
              <div className="flex gap-4">
                <Drivers
                  selectedKey={formState.driver}
                  onSelectionChange={(e) => {
                    console.log(e);

                    setFormState((prev) => ({
                      ...prev,
                      driver: e,
                    }));
                  }}
                />

                <Cities
                  label="Город получатель"
                  selectedKey={formState.city_to}
                  onSelectionChange={(e) => {
                    setFormState((prev) => ({
                      ...prev,
                      city_to: e,
                    }));
                  }}
                />

                <Cities
                  label="Город отправитель"
                  selectedKey={formState.city_from}
                  onSelectionChange={(e) => {
                    setFormState((prev) => ({
                      ...prev,
                      city_from: e,
                    }));
                  }}
                />
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={() => {
                  onOpenChangeTrip();
                }}
              >
                Отмена
              </Button>
              <Button type="submit">Добавить</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

const SummaryOfTrip = ({ week }) => {
  return (
    <div className="flex gap-2">
      <span>рейсов: {week.trips.length}</span>
      <span>
        грузов: {week.trips.reduce((acc, trip) => acc + trip.cargos.length, 0)}
      </span>
      <span>{new Date(week.created_at).toLocaleDateString()}</span>
      <span>{new Date(week.created_at).toLocaleTimeString()}</span>
    </div>
  );
};
