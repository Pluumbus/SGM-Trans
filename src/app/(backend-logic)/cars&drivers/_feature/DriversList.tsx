import { getDrivers } from "@/lib/references/drivers/feature/api";
import { DriversType } from "@/lib/references/drivers/feature/types";
import {
  Card,
  Button,
  Listbox,
  ListboxItem,
  useDisclosure,
  Spinner,
  Input,
  CardHeader,
} from "@nextui-org/react";
import driverImg from "@/app/_imgs/driver-icon.png";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  AddTruckObjectsModal,
  ModalTitleItems,
  useDeleteObject,
} from "./Modals/AddTruckObjectsModal";
import Image from "next/image";
import supabase from "@/utils/supabase/client";

export const DriversList = () => {
  const { data: driversData, isLoading } = useQuery({
    queryKey: ["GetDrivers"],
    queryFn: async () => getDrivers(),
  });
  const [drivers, setDrivers] = useState<DriversType[]>(driversData || []);
  const [tempDrivers, setTempDrivers] = useState<DriversType[]>(drivers);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { confirmDeleteObject } = useDeleteObject();
  useEffect(() => {
    const driver = driversData?.filter((d) => d.car_type == "truck");
    setDrivers(driver);
    setTempDrivers(driver);
  }, [driversData]);

  useEffect(() => {
    const cn = supabase
      .channel(`drivers-list/cars&drivers`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drivers",
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setDrivers((prev) => {
              return prev.filter((d) => d.id !== payload.old.id);
            });
            setTempDrivers((prev) => {
              return prev.filter((d) => d.id !== payload.old.id);
            });
          } else {
            setDrivers((prev) => [...prev, payload.new as DriversType]);
            setTempDrivers((prev) => [...prev, payload.new as DriversType]);
          }
        },
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  const handleFilterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDrivers(
      drivers.filter((d) => d.name.includes(e.target.value.toUpperCase())),
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-center">
          <Image src={driverImg} alt="driver-icon" width={50} />
        </CardHeader>
        <Input
          variant="bordered"
          placeholder="Поиск по имени"
          onChange={handleFilterData}
        />
        <Button variant="faded" onPress={onOpen}>
          Добавить
        </Button>
        <Listbox aria-label="drivers-list">
          {tempDrivers?.map((d) => (
            <ListboxItem
              key={d.id}
              className="border-b"
              textValue={d.name}
              onClick={() => confirmDeleteObject(d.id, "drivers", d.name)}
            >
              {d.name}
            </ListboxItem>
          ))}
        </Listbox>
      </Card>
      <AddTruckObjectsModal
        isOpen={isOpen}
        modalTitle={ModalTitleItems[0]}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
