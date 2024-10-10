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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import supabase from "@/utils/supabase/client";
import { AddWeek } from "./Modals/AddWeek";
import { useToast } from "@/components/ui/use-toast";
import { WeekType } from "../types";
import { Cities, Drivers } from "@/lib/references";
import { getWeeks } from "../../[slug]/week/[weekId]/trip/_api";
import { TripType } from "../TripCard/TripCard";
import { useParams } from "next/navigation";
import { WeekTableType } from "../../[slug]/week/[weekId]/trip/types";
import { FiPlus } from "react-icons/fi";

export const WeekCard = () => {
  const { slug } = useParams();

  const { data: dataWeeks, isLoading: isLoadingWeeks } = useQuery({
    queryKey: [`weeks-${slug}`],
    queryFn: async () => await getWeeks(slug as WeekTableType),
  });

  const [weeks, setWeeks] = useState<(WeekType & { trips: TripType[] })[]>(
    dataWeeks || []
  );

  useEffect(() => {
    if (dataWeeks) {
      setWeeks(dataWeeks);
      console.log("dataWeeks", dataWeeks);
      console.log("weeks", weeks);
    }
  }, [dataWeeks]);

  useEffect(() => {
    const cn = supabase
      .channel("view-weeks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weeks",
          filter: `table_type=eq.${slug}`,
        },
        (payload) => {
          setWeeks((prev) => [
            ...prev,
            payload.new as WeekType & { trips: TripType[] },
          ]);
          console.log("dataWeeks", dataWeeks);
          console.log("weeks", weeks);
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (isLoadingWeeks) {
    return <Spinner />;
  }

  return (
    <div>
      <AddWeek />
      <div className="flex gap-4 w-full min-h-44">
        <Accordion selectionMode="multiple">
          {weeks.toReversed().map((week, i) => (
            <AccordionItem
              key={i + 1}
              aria-label={`Accordion ${i}`}
              title={`Неделя ${week.week_number}`}
              subtitle={<SummaryOfTrip week={week} />}
            >
              <CreateTripInsideWeek
                weekId={week.id.toString()}
                inTrip={false}
              />
              <TripCard weekId={week.id.toString()} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export const CreateTripInsideWeek = ({
  weekId,
  inTrip,
}: {
  weekId: string;
  inTrip: boolean;
}) => {
  const { toast } = useToast();
  const { slug } = useParams();
  const isMSK = slug == "ru";
  const { isOpen: isOpenTrip, onOpenChange: onOpenChangeTrip } =
    useDisclosure();
  const initData = {
    city_from: isMSK ? "Москва" : "",
    city_to: [""],
    driver: "",
  };

  const [formState, setFormState] = useState<{
    city_from: any;
    city_to: string[];
    driver: any;
  }>(initData);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await supabase.from("trips").insert({
        city_from: formState.city_from,
        city_to: formState.city_to.filter((city) => city !== ""),
        driver: formState.driver,
        week_id: weekId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Вы успешно создали путь",
      });
      onOpenChangeTrip();
      setFormState(initData);
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

  const handleCityToChange = (index, newCity) => {
    const updatedCityTo = [...formState.city_to];
    updatedCityTo[index] = newCity;

    if (index === updatedCityTo.length - 1 && newCity !== "") {
      updatedCityTo.push("");
    }

    setFormState((prev) => ({
      ...prev,
      city_to: updatedCityTo,
    }));
  };

  return (
    <div>
      {inTrip ? (
        <Button className="h-20" variant="light">
          <FiPlus
            size={35}
            onClick={() => {
              onOpenChangeTrip();
            }}
          />
        </Button>
      ) : (
        <Button
          onClick={() => {
            onOpenChangeTrip();
          }}
        >
          Добавить путь{" "}
        </Button>
      )}

      <Modal isOpen={isOpenTrip} onOpenChange={onOpenChangeTrip} size="2xl">
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>Добавить путь</ModalHeader>
            <Divider />
            <ModalBody className="grid grid-cols-2 gap-2">
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
                label="Город отправитель"
                selectedKey={formState.city_from}
                isReadOnly={isMSK}
                onSelectionChange={(e) => {
                  setFormState((prev) => ({
                    ...prev,
                    city_from: e,
                  }));
                }}
              />

              {formState.city_to.map((city, index) => (
                <Cities
                  key={index}
                  label={`Город получатель ${index + 1}`}
                  selectedKey={city}
                  onSelectionChange={(e) => handleCityToChange(index, e)}
                />
              ))}
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

const SummaryOfTrip = ({
  week,
}: {
  week: WeekType & { trips: TripType[] };
}) => {
  return (
    <div className="flex gap-2 items-center">
      <span>
        {week?.week_dates?.start_date} - {week?.week_dates?.end_date}
      </span>
      <Divider orientation="vertical" className="!min-h-4 !w-[1px]" />
      <span>Рейсов: {week?.trips?.length || 0}</span>
    </div>
  );
};
