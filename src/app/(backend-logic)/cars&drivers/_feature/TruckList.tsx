"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MouseEventHandler, useEffect, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  CarsType,
  DriversType,
  TrailersType,
} from "../../../../lib/references/drivers/feature/types";
import {
  getCars,
  getDrivers,
  getTrailers,
} from "@/lib/references/drivers/feature/api";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { toast } from "@/components/ui/use-toast";
import { setDriver, setCar, setTrailer, deleteObj } from "../_api/requests";
import { useConfirmContext } from "@/tool-kit/hooks";

export const DriversList = () => {
  const [modalTitle, setModalTitle] = useState<string>("");
  const [mutateObj, setMutateObj] = useState({
    input1: "",
    input2: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["GetCars"],
    queryFn: async () => getCars(),
  });

  const { data: driversData } = useQuery({
    queryKey: ["GetDrivers"],
    queryFn: async () => getDrivers(),
  });

  const { data: trailersData } = useQuery({
    queryKey: ["getTrailers"],
    queryFn: async () => getTrailers(),
  });

  const [cars, setCars] = useState<CarsType[]>(carsData || []);
  const [drivers, setDrivers] = useState<DriversType[]>(driversData || []);
  const [trailers, setTrailers] = useState<TrailersType[]>(trailersData || []);

  useEffect(() => {
    const cars = carsData?.filter((c) => c.car_type == "truck");
    const driver = driversData?.filter((d) => d.car_type == "truck");
    setCars(cars);
    setDrivers(driver);
    setTrailers(trailersData);
  }, [carsData, driversData, trailersData]);

  const { mutate } = useMutation({
    mutationFn: async (type: string) => {
      return type == ModalTitleItems[0]
        ? await setDriver(mutateObj.input1)
        : type == ModalTitleItems[1]
          ? await setCar(mutateObj)
          : await setTrailer(mutateObj);
    },
    onSuccess: () => {
      toast({ title: "Успешно добавлен(а)" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Объект уже есть в списке" });
    },
  });

  const { mutate: deleteObject, isPending } = useMutation({
    mutationFn: async ({ id, table }: { id: number; table: string }) =>
      await deleteObj(id, table),
    onSuccess: () => {
      toast({ title: "Объект успешно удалён" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Попробуйте позже" });
    },
  });
  const ModalTitleItems = [
    "Добавить водителя",
    "Добавить машину",
    "Добавить прицеп",
  ];

  const { openModal } = useConfirmContext();
  useEffect(() => {
    console.log(mutateObj);
  }, [mutateObj]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMutateObj((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePress = (name: string, table: string, id: number) => {
    openModal({
      action: async () => deleteObject({ id: id, table: table }),
      title: "Подтвердите действие",
      description: `Вы уверены что хотите удалить ${name}?`,
      buttonName: "Подтвердить",
      isLoading: isPending,
    });
  };

  if (isLoading) return <SgmSpinner />;

  return (
    <div className="flex gap-10 ">
      <Card className="w-9/12">
        <Button
          variant="faded"
          onPress={() => {
            onOpen();
            setModalTitle(ModalTitleItems[0]);
          }}
        >
          Добавить
        </Button>
        <Listbox aria-label="drivers-list">
          {drivers?.map((d) => (
            <ListboxItem
              key={d.id}
              className="border-b"
              textValue={d.name}
              onClick={() => handlePress(d.name, "drivers", d.id)}
            >
              {d.name}
            </ListboxItem>
          ))}
        </Listbox>
      </Card>

      <Card className="w-full ">
        <Button
          variant="faded"
          onPress={() => {
            onOpen();
            setModalTitle(ModalTitleItems[1]);
          }}
        >
          Добавить
        </Button>
        <Listbox aria-label="drivers-list">
          {cars?.map((car) => (
            <ListboxItem
              key={car.id}
              className="border-b"
              textValue={car.car}
              onClick={() =>
                handlePress(car.car + " | " + car.state_number, "cars", car.id)
              }
            >
              {car.car + " | " + car.state_number}
            </ListboxItem>
          ))}
        </Listbox>
      </Card>

      <Card className="w-full">
        <Button
          variant="faded"
          onPress={() => {
            onOpen();
            setModalTitle(ModalTitleItems[2]);
          }}
        >
          Добавить
        </Button>
        <Listbox aria-label="drivers-list">
          {trailers?.map((tr) => (
            <ListboxItem
              key={tr.id}
              className="border-b"
              textValue={tr.trailer}
              onClick={() =>
                handlePress(
                  tr.trailer + " | " + tr.state_number,
                  "trailers",
                  tr.id
                )
              }
            >
              {tr.trailer + " | " + tr.state_number}
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
                {modalTitle == ModalTitleItems[0] && (
                  <div>
                    <p>Введите Ф.И.О. водителя</p>
                    <Input
                      name="input1"
                      variant="bordered"
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {modalTitle == ModalTitleItems[1] && (
                  <div>
                    <p>Введите марку машины и номер</p>
                    <div className="flex gap-4">
                      <Input
                        name="input1"
                        variant="bordered"
                        placeholder="DAF XF 480"
                        onChange={handleInputChange}
                      />
                      <Input
                        name="input2"
                        variant="bordered"
                        placeholder="747 CU 01"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                {modalTitle == ModalTitleItems[2] && (
                  <div>
                    <p>Введите марку прицепа и номер</p>
                    <div className="flex gap-4">
                      <Input
                        name="input1"
                        variant="bordered"
                        placeholder="SCHMITZ CARGOBUUL"
                        onChange={handleInputChange}
                      />
                      <Input
                        name="input2"
                        variant="bordered"
                        placeholder="18 AFT 01"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    mutate(modalTitle);
                    onClose();
                  }}
                >
                  Подтвердить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
