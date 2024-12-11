"use client";
import { toast } from "@/components/ui/use-toast";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Listbox,
  ListboxItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import gazellImg from "@/app/_imgs/gazell-icon.png";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { DriversWithCars } from "@/lib/references/drivers/feature/types";
import { useEffect, useState } from "react";
import { getDriversWithCars } from "@/lib/references/drivers/feature/api";
import {
  AddTruckObjectsModal,
  ModalTitleItems,
} from "./Modals/AddTruckObjectsModal";
import supabase from "@/utils/supabase/client";

export const GazellList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getDriversWithGazellCars"],
    queryFn: getDriversWithCars,
  });
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [gazellData, setGazellData] = useState<DriversWithCars[]>(data);

  useEffect(() => {
    if (data)
      setGazellData(
        data.filter((e) => e.car_type === "gazell" && e.name !== "Наемник")
      );
  }, [data]);

  // useEffect(() => {
  //   const cn = supabase
  //     .channel(`gazelles-list/cars&drivers`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "cars",
  //       },
  //       (payload) => {
  //         if (payload.eventType === "DELETE") {
  //           setGazellData((prev) => {
  //             return prev.filter((d) => d.id !== payload.old.id);
  //           });
  //         } else {
  //           setGazellData((prev) => [...prev, payload.new as DriversWithCars]);
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     cn.unsubscribe();
  //   };
  // }, []);

  const handleCopyDriverData = (id) => {
    const dataToCopy = data.filter((car) => car.id == id)[0];
    copyToClipboard(
      dataToCopy.name +
        "\n" +
        "Автомобиль: " +
        dataToCopy.cars.car +
        "\n" +
        "Гос.номер: " +
        dataToCopy.cars.state_number +
        "\n" +
        "Номер: " +
        dataToCopy.passport_data.id +
        "\n" +
        "Выдан: " +
        dataToCopy.passport_data.issued +
        "\n" +
        "Дата: " +
        dataToCopy.passport_data.date
    );
    toast({
      title: `Данные водителя успешно скопированы в буфер обмена`,
    });
  };
  if (isLoading) return <Spinner />;
  return (
    <div>
      <Card className="h-full">
        <CardHeader className="flex justify-center">
          <Image src={gazellImg} alt="gazell-icon" width={50} />
        </CardHeader>
        <Input
          variant="bordered"
          placeholder="Поиск по имени"
          // onChange={handleFilterData}
        />
        <Button variant="faded" onPress={onOpen}>
          Добавить
        </Button>
        <Listbox
          aria-label="drivers-list"
          onAction={(key) => handleCopyDriverData(key)}
        >
          {gazellData?.map((gzl) => (
            <ListboxItem key={gzl.id} className="border-b">
              {(gzl.name || "Без водителя") +
                " | " +
                gzl.cars?.car +
                " - " +
                gzl.cars?.state_number}
            </ListboxItem>
          ))}
        </Listbox>
      </Card>
      <AddTruckObjectsModal
        isOpen={isOpen}
        modalTitle={ModalTitleItems[3]}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
