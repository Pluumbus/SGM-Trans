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
import { CarsType, FullDriversType } from "../_api/types";
import { COLORS } from "@/lib/colors";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "@/components/ui/use-toast";
import { updateTrailerData } from "../_api/requests";
import supabase from "@/utils/supabase/client";

//TODO: Отображются не все трейлеры, пофиксить реалтайм и драйверов
export const DriversList = () => {
  const [driversCarData, setDriversCarData] =
    useState<Record<string, FullDriversType[]>>();

  const [modalTitle, setModalTitle] = useState("");
  const [itemChangeId, setItemChangeId] = useState<number>();
  const [currCarID, setCurrCarId] = useState<number>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["GetDrivers"],
    queryFn: async () => getDriversWithCars(),
  });

  const { mutate } = useMutation({
    mutationKey: ["ChangeDriverAndCars"],
    mutationFn: async () => await updateTrailerData(currCarID, itemChangeId),
    onSuccess() {
      toast({ description: "Прицеп обновлён" });
    },
  });

  useEffect(() => {
    data?.sort((a, b) => {
      if (a.car == null) return 1;
      if (b.car == null) return -1;
      return 0;
    });

    setDriversCarData(
      data?.reduce(
        (acc, car) => {
          if (!acc[car.car_type]) acc[car.car_type] = [];
          acc[car.car_type]?.push(car);
          return acc;
        },
        {} as Record<string, FullDriversType[]>
      )
    );
  }, [data, isFetched]);

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
  //         console.log(updatedCarData);
  //         const newCarData = driversCarData["truck"].map((item) => {
  //           item.id == updatedCarData.id
  //             ? updatedCarData.trailer_id
  //             : item.trailer_id;
  //           return {
  //             ...item,
  //             trailer_id: updatedCarData.trailer_id,
  //           } as FullDriversType;
  //         });

  //         const res = newCarData?.reduce(
  //           (acc, car) => {
  //             if (!acc[car.car_type]) acc[car.car_type] = [];
  //             acc[car.car_type]?.push(car);
  //             return acc;
  //           },
  //           {} as Record<string, FullDriversType[]>
  //         );
  //         console.log(res);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     cn.unsubscribe();
  //   };
  // }, []);

  if (isLoading) return <Spinner />;

  const handleCopyDriverData = (id) => {
    const dataToCopy = driversCarData["gazell"].filter(
      (car) => car.id == id
    )[0];
    copyToClipboard(
      dataToCopy.drivers[0].name +
        "\n" +
        "Автомобиль: " +
        dataToCopy.car +
        "\n" +
        "Гос.номер: " +
        dataToCopy.state_number +
        "\n" +
        "Номер: " +
        dataToCopy.drivers[0].passport_data.id +
        "\n" +
        "Выдан: " +
        dataToCopy.drivers[0].passport_data.issued +
        "\n" +
        "Дата: " +
        dataToCopy.drivers[0].passport_data.date
    );
    toast({
      title: `Данные водителя успешно скопированы в буфер обмена`,
    });
  };

  const handleCurrItem = (key) => {
    console.log(key);
    setCurrCarId(key);
  };

  const handleMutate = () => {
    mutate();
  };

  const handleAutoComplete = (value: string) => {
    console.log(Number(value.slice(0, 1)));
    setItemChangeId(Number(value.slice(0, 1)));
  };
  const ddItems = ["Замена водителя", "Замена прицепа"];

  return (
    <div className="flex justify-around">
      <Card className="w-1/3">
        <Listbox aria-label="drivers-list">
          {driversCarData != undefined &&
            driversCarData["truck"]?.map((car) => (
              <ListboxItem
                key={car.id}
                style={{
                  color: car.drivers[0]?.name ? COLORS.green : COLORS.red,
                }}
                className="border-b"
              >
                <Dropdown>
                  <DropdownTrigger onClick={() => handleCurrItem(car.id)}>
                    {(car.drivers[0]?.name || "Без водителя") +
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
                        onClick={(key) => {
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
      <Card className="w-1/4">
        <Listbox
          aria-label="drivers-list"
          onAction={(key) => handleCopyDriverData(key)}
        >
          {driversCarData != undefined &&
            driversCarData["gazell"]?.map((gzl) => (
              <ListboxItem key={gzl.id} className="border-b">
                {(gzl.drivers[0]?.name || "Без водителя") + " | " + gzl.car}
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
                    <Autocomplete aria-label="Change driver">
                      {driversCarData["truck"].map((item) => (
                        <AutocompleteItem
                          key={item.id}
                          onInput={() => setItemChangeId(item.drivers?.id)}
                        >
                          {item.drivers?.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                ) : (
                  <div>
                    <Autocomplete
                      aria-label="Change trailer"
                      onInputChange={handleAutoComplete}
                    >
                      {driversCarData["truck"]
                        .filter((item) => item.trailers)
                        .sort((item) => item.trailer_id)
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
                  </div>
                )}
                <Button
                  color="success"
                  onClick={() => {
                    handleMutate();
                    onClose();
                  }}
                >
                  Подтвердить
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
