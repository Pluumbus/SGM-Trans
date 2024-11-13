"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDriversWithCars } from "../_api";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  CarsType,
  DriversType,
  FullDriversType,
} from "../../../../lib/references/drivers/feature/types";
import { COLORS } from "@/lib/colors";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "@/components/ui/use-toast";
import { updateDriverData, updateTrailerData } from "../_api/requests";
import { getDrivers } from "@/lib/references/drivers/feature/api";
import supabase from "@/utils/supabase/client";
import { GazellList } from "./GazellList";

export const DriversList = () => {
  const [driversTruckData, setDriversTruckData] = useState<FullDriversType[]>();
  const [driversGazellData, setDriversGazellData] =
    useState<FullDriversType[]>();

  const [drivers, setDrivers] = useState<DriversType[]>();
  const [modalTitle, setModalTitle] = useState("");
  const [itemChangeId, setItemChangeId] = useState<number>();
  const [currCarID, setCurrCarId] = useState<number>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["GetAllDataByCars"],
    queryFn: async () => getDriversWithCars(),
  });

  const { data: driversData, isFetched: driversFetched } = useQuery({
    queryKey: ["GetDrivers"],
    queryFn: async () => getDrivers(),
  });

  const { mutate: trailerMutate } = useMutation({
    mutationKey: ["ChangeTrailer"],
    mutationFn: async () => await updateTrailerData(currCarID, itemChangeId),
    onSuccess() {
      toast({ description: "Прицеп обновлён" });
    },
  });
  const { mutate: driverMutate } = useMutation({
    mutationKey: ["ChangeDrivers"],
    mutationFn: async () => await updateDriverData(itemChangeId, currCarID),
    onSuccess() {
      toast({ description: "Водитель обновлён" });
    },
  });

  const ddItems = ["Замена водителя", "Замена прицепа"];

  useEffect(() => {
    data?.sort((a, b) => {
      if (a.car == null) return 1;
      if (b.car == null) return -1;
      return 0;
    });

    const cars =
      isFetched &&
      data?.reduce(
        (acc, car) => {
          if (!acc[car.car_type]) acc[car.car_type] = [];
          acc[car.car_type]?.push(car);
          return acc;
        },
        {} as Record<string, FullDriversType[]>,
      );
    setDriversTruckData(cars["truck"]);
    setDriversGazellData(cars["gazell"]);
    setDrivers(driversData);
  }, [data, isFetched, driversData, driversFetched]);

  // useEffect(() => {
  //   const cn = supabase
  //     .channel(`driver&cars`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "cars",
  //       },
  //       (payload) => {
  //         const updatedCarData = payload.new as CarsType;
  //         if (updatedCarData.car_type == "truck") {
  //           const oldCarToChange = driversTruckData?.filter(
  //             (car) => car.id === updatedFullDriversData.id
  //           )[0];
  //           const updatedFullDriversData: FullDriversType = {
  //             ...updatedCarData,
  //             car_type: oldCarToChange?.car_type,
  //             drivers: oldCarToChange?.drivers,
  //             trailers: oldCarToChange?.trailers,
  //           };
  //           console.log("updatedFullDriversData", updatedFullDriversData);

  //           setDriversTruckData((prev) =>
  //             prev.map((item) =>
  //               item.id === updatedCarData.id ? updatedFullDriversData : item
  //             )
  //           );
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     cn.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const cn = supabase
      .channel(`driver&cars`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drivers",
        },
        (payload) => {
          const updatedDriverData = payload.new as DriversType;

          const oldDriverToChange = driversTruckData?.filter(
            (item) =>
              item.drivers.length > 0 &&
              item.drivers[0].id === updatedDriverData.id,
          )[0];

          const updatedFullDriversData: FullDriversType = {
            ...oldDriverToChange,
            drivers: Array(updatedDriverData),
          };

          console.log("updatedFullDriversData", updatedFullDriversData);

          setDriversTruckData((prev) =>
            prev.map((item) =>
              item.id === updatedDriverData.id ? updatedFullDriversData : item,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  const handleCurrItem = (key) => {
    console.log(key);
    setCurrCarId(key);
  };

  const handleTrailerMutate = () => {
    trailerMutate();
  };
  const handleDriverMutate = () => {
    driverMutate();
  };
  const handleAutoComplete = (value: string) => {
    console.log(Number(value.slice(0, 2)));
    setItemChangeId(Number(value.slice(0, 2)));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex justify-around">
      <Card className="w-1/3">
        <Listbox aria-label="drivers-list">
          {driversTruckData != undefined &&
            driversTruckData?.map((car) => (
              <ListboxItem
                key={car.id}
                style={{
                  color: car?.drivers?.length > 0 ? COLORS.green : COLORS.red,
                }}
                className="border-b"
                textValue={car.car}
              >
                <Dropdown>
                  <DropdownTrigger onClick={() => handleCurrItem(car.id)}>
                    {((car?.drivers?.length > 0 && car.drivers[0]?.name) ||
                      "Без водителя") +
                      " | " +
                      car.car +
                      " - " +
                      car.state_number +
                      " | " +
                      (car.trailers?.trailer !== undefined
                        ? car.trailers?.trailer +
                          " " +
                          car.trailers?.state_number
                        : "Без прицепа")}
                  </DropdownTrigger>
                  <DropdownMenu>
                    {ddItems.map((item: string) => (
                      <DropdownItem
                        key={item}
                        onClick={() => {
                          setModalTitle(item);
                          onOpen();
                        }}
                      >
                        {item}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ListboxItem>
            ))}
        </Listbox>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                <p>Выберите на что заменить</p>
                {modalTitle == ddItems[0] ? (
                  <div>
                    <Autocomplete
                      aria-label="Change driver"
                      onInputChange={handleAutoComplete}
                    >
                      {drivers
                        .filter((driver) => driver.car_type !== "gazell")
                        .map((driver) => (
                          <AutocompleteItem key={driver.id}>
                            {driver.id + " | " + driver.name}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <div className="flex justify-end">
                      <Button
                        color="success"
                        onClick={() => {
                          trailerMutate();
                          onClose();
                        }}
                      >
                        Подтвердить
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Autocomplete
                      aria-label="Change trailer"
                      onInputChange={handleAutoComplete}
                    >
                      {driversTruckData
                        .filter((item) => item.trailers)
                        .sort((a, b) => a.id - b.id)
                        .map((item) => (
                          <AutocompleteItem key={item.id}>
                            {item.trailer_id +
                              " | " +
                              item.trailers.trailer +
                              " " +
                              item.trailers.state_number}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <div className="flex justify-end">
                      <Button
                        color="success"
                        onClick={() => {
                          handleTrailerMutate();
                          onClose();
                        }}
                      >
                        Подтвердить
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <GazellList driversGazellData={driversGazellData} />
    </div>
  );
};
