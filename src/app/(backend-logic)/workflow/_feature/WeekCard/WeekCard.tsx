"use client";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { TripCard } from "../TripCard";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import supabase from "@/utils/supabase/client";
import { AddWeek } from "./Modals/AddWeek";
import { useToast } from "@/components/ui/use-toast";
import { WeekType } from "../types";
import { Cities, Drivers } from "@/lib/references";
import { getWeeks } from "../../[slug]/week/[weekId]/trip/_api";
import { useParams } from "next/navigation";
import { WeekTableType } from "../../[slug]/week/[weekId]/trip/_api/types";
import { FiPlus } from "react-icons/fi";
import { TripType } from "../TripCard/TripCard";
import { Cars } from "@/lib/references/drivers/Cars";

export const WeekCard = () => {
  const { slug } = useParams();

  const [weeks, setWeeks] = useState<(WeekType & { trips: TripType[] })[]>([]);

  const { mutate, isPending } = useMutation({
    mutationKey: [`weeks-${slug}`],
    mutationFn: async () => await getWeeks(slug as WeekTableType),
    onSuccess: (data) => {
      setWeeks(data);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    const cn = supabase
      .channel(`view-weeks-${slug}`)
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
            { ...payload.new, trips: [] } as WeekType & { trips: TripType[] },
          ]);
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  const CurrentWeekIndicator = ({ end_date, start_date }) => {
    const today = new Date();

    const start = new Date(start_date);
    const end = new Date(end_date);

    return today >= start && today <= end;
  };

  if (isPending) {
    return <Spinner />;
  }
  return (
    <div>
      <AddWeek />
      <div className="flex gap-4 w-full min-h-44">
        <Accordion selectionMode="multiple">
          {weeks
            .toReversed()
            .sort((a, b) => b.week_number - a.week_number)
            .map((week, i) => (
              <AccordionItem
                key={i + 1}
                aria-label={`Accordion ${i}`}
                title={`Неделя ${week.week_number}`}
                subtitle={<SummaryOfTrip week={week} />}
                className={
                  CurrentWeekIndicator(week.week_dates) ? "bg-orange-300" : ""
                }
              >
                <CreateTripInsideWeek key={i + 5} weekId={week.id.toString()} />
                <TripCard weekId={week.id.toString()} setWeeks={setWeeks} />
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export const CreateTripInsideWeek = ({
  weekId,
  inTrip = false,
}: {
  weekId: string;
  inTrip?: boolean;
}) => {
  const { toast } = useToast();
  const { slug } = useParams();
  const isMSK = slug == "ru";
  const { isOpen: isOpenTrip, onOpenChange: onOpenChangeTrip } =
    useDisclosure();
  const initData = {
    city_from: isMSK ? ["Москва"] : [""],
    city_to: isMSK ? [""] : ["Москва"],
    driver: "",
    car: "",
  };

  const [formState, setFormState] = useState<{
    city_from: any;
    city_to: string[];
    driver: string;
    car: string;
  }>(initData);

  const [isHire, setIsHire] = useState(false);
  const [tripCar, setTripCar] = useState<{
    car: string;
    state_number: string;
  }>();
  const { mutate } = useMutation({
    mutationFn: async () => {
      await supabase.from("trips").insert({
        city_from: formState.city_from,
        city_to: formState.city_to.filter((city) => city !== ""),
        driver: {
          car: formState.car.split(" - ")[0],
          driver: formState.driver,
          state_number: formState.car.split(" - ")[1],
        },
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
    if (
      formState.driver &&
      formState.city_from[0] != "" &&
      formState.city_to[0] != ""
    )
      mutate();
    else
      toast({
        title: "Ошбика",
        description: "Заполните все поля",
      });
  };

  const handleCityToChange = (index, newCity, isCityTo = true) => {
    const updatedCityTo = isCityTo
      ? [...formState.city_to]
      : [...formState.city_from];

    updatedCityTo[index] = newCity;

    if (index === updatedCityTo.length - 1 && newCity !== "") {
      updatedCityTo.push("");
    }

    switch (isCityTo) {
      case true:
        setFormState((prev) => ({
          ...prev,
          city_to: updatedCityTo,
        }));
        break;
      case false:
        setFormState((prev) => ({
          ...prev,
          city_from: updatedCityTo,
        }));
      default:
        break;
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTripCar((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormState((prev) => ({
      ...prev,
      car: tripCar.car + " - " + tripCar.state_number,
    }));
    // if (tripCar.car !== "" && tripCar.state_number !== "")
    //   setTripCar(tripCar.car + " - " + tripCar.state_number);
  };
  return (
    <div>
      {inTrip ? (
        <div className="cursor-pointer pt-5 pb-5 ">
          <FiPlus
            size={40}
            onClick={() => {
              onOpenChangeTrip();
            }}
          />
        </div>
      ) : (
        <Button
          onClick={() => {
            onOpenChangeTrip();
          }}
        >
          Добавить путь
        </Button>
      )}

      <Modal isOpen={isOpenTrip} onOpenChange={onOpenChangeTrip} size="2xl">
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>Добавить путь</ModalHeader>
            <Divider />
            <ModalBody className={!isHire ? "grid grid-cols-2 gap-2" : "flex"}>
              {/* <ModalBody className="flex"> */}
              {!isHire ? (
                <>
                  <div className="flex flex-col">
                    <Drivers
                      selectedKey={formState.driver}
                      onSelectionChange={(e) => {
                        setFormState((prev) => ({
                          ...prev,
                          driver: e.toString(),
                        }));
                      }}
                    />
                    {!formState.driver && (
                      <span className="text-danger-400 text-xs pl-1">
                        Выберите водителя*
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Cars
                      selectedKey={formState.car}
                      onSelectionChange={(e) => {
                        setFormState((prev) => ({
                          ...prev,
                          car: e.toString(),
                        }));
                      }}
                    />
                    {!formState.car && (
                      <span className="text-danger-400 text-xs pl-1">
                        Выберите машину*
                      </span>
                    )}
                  </div>
                  {formState.city_to.map((city, index) => (
                    <Cities
                      key={index + 1}
                      isReadOnly={!isMSK}
                      label={`Город получатель ${index + 1}`}
                      selectedKey={city}
                      onSelectionChange={(e) => handleCityToChange(index, e)}
                    />
                  ))}
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div>
                      <Input
                        variant="bordered"
                        placeholder="Иванов Иван"
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            driver: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Input
                        name="car"
                        variant="bordered"
                        placeholder="DAF XF 480"
                        onChange={handleInputChange}
                      />
                      <Input
                        name="state_number"
                        variant="bordered"
                        placeholder="747 CU 01"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {formState.city_to.map((city, index) => (
                      <Cities
                        key={index + 1}
                        isReadOnly={!isMSK}
                        label={`Город получатель ${index + 1}`}
                        selectedKey={city}
                        onSelectionChange={(e) => handleCityToChange(index, e)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* {formState.city_from.map((city, index) => (
                <Cities
                  key={index + 2}
                  label={`Город отправитель ${index + 1}`}
                  selectedKey={city}
                  isReadOnly={isMSK}
                  onSelectionChange={(e) => handleCityToChange(index, e, false)}
                />
              ))} */}

              {/* <div className="grid grid-cols-2 gap-2">
                {formState.city_to.map((city, index) => (
                  <Cities
                    key={index + 1}
                    isReadOnly={!isMSK}
                    label={`Город получатель ${index + 1}`}
                    selectedKey={city}
                    onSelectionChange={(e) => handleCityToChange(index, e)}
                  />
                ))}
              </div> */}
            </ModalBody>
            <Divider />
            <ModalFooter className="flex justify-between">
              <Button
                color={!isHire ? "primary" : "warning"}
                onPress={() => {
                  !isHire ? setIsHire(true) : setIsHire(false);
                }}
              >
                {!isHire ? (
                  <span>Добавить наёмного водителя</span>
                ) : (
                  <span>Добавить своего водителя</span>
                )}
              </Button>

              <Button type="submit" color="success">
                Добавить
              </Button>
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
      <span>
        Рейсов: {week?.trips?.length > 0 ? week?.trips?.length + " | " : 0}
        {week?.trips.map((t, i) => (
          <span>
            {t.trip_number + (i === week?.trips?.length - 1 ? ". " : ", ")}
          </span>
        ))}{" "}
      </span>
    </div>
  );
};
