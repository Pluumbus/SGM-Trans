import { getCars } from "@/lib/references/drivers/feature/api";
import { CarsType } from "@/lib/references/drivers/feature/types";
import {
  Card,
  Button,
  Listbox,
  ListboxItem,
  Spinner,
  useDisclosure,
  Input,
  CardHeader,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import truckImg from "@/app/_imgs/truck-icon.png";

import {
  AddTruckObjectsModal,
  ModalTitleItems,
  useDeleteObject,
} from "./Modals/AddTruckObjectsModal";
import Image from "next/image";
export const CarList = () => {
  const { data: carsData, isLoading } = useQuery({
    queryKey: ["GetCars"],
    queryFn: async () => getCars(),
  });
  const [cars, setCars] = useState<CarsType[]>(carsData || []);
  const [tempCars, setTempCars] = useState<CarsType[]>(cars);
  const { confirmDeleteObject } = useDeleteObject();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const cars = carsData?.filter((c) => c.car_type == "truck");
    setCars(cars);
    setTempCars(cars);
  }, [carsData]);

  const handleFilterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempCars(
      cars.filter((c) => c.state_number.includes(e.target.value.toUpperCase()))
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-center">
          <Image src={truckImg} alt="truck-icon" width={50} />
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
          {tempCars?.map((car) => (
            <ListboxItem
              key={car.id}
              className="border-b"
              textValue={car.car}
              onClick={() =>
                confirmDeleteObject(
                  car.id,
                  "cars",
                  car.car + " | " + car.state_number
                )
              }
            >
              {car.car + " | " + car.state_number}
            </ListboxItem>
          ))}
        </Listbox>
      </Card>
      <AddTruckObjectsModal
        isOpen={isOpen}
        modalTitle={ModalTitleItems[1]}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};