import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { toast } from "@/components/ui/use-toast";
import { getDrivers, getCars } from "@/lib/references/drivers/feature/api";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { updateTripDriver } from "../../../_api/requests";

export const TripInfoDriver = ({
  currentTripData,
  tripId,
  tripsData,
}: {
  tripsData: TripType[];
  currentTripData: TripType;
  tripId: number;
}) => {
  const [tripDriver, setTripDriver] = useState(currentTripData?.driver.driver);
  const [tripCar, setTripCar] = useState("");
  const [secondaryInputCar, setSecondaryInputCar] = useState({
    car: "",
    state_number: "",
  });

  const [isHireDriver, setIsHireDriver] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange: onOpenModalChange } = useDisclosure();

  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["GetDrivers"],
    queryFn: getDrivers,
  });

  const { data: carData, isLoading: carLoading } = useQuery({
    queryKey: ["GetCars"],
    queryFn: async () => await getCars(),
  });

  const { mutate: setDriverMutation } = useMutation({
    mutationKey: ["setTripStatus"],
    mutationFn: async () => {
      const [car, state_number] = tripCar.split(" - ");

      await updateTripDriver(
        { driver: tripDriver, car: car, state_number: state_number },
        tripId,
      );
    },
    onSuccess() {
      toast({
        title: "Водитель рейса успешно обновлён",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecondaryInputCar((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (secondaryInputCar.car !== "" && secondaryInputCar.state_number !== "")
      setTripCar(
        secondaryInputCar.car + " - " + secondaryInputCar.state_number,
      );
  };
  //#TODO: Если надо будет убирать водителей которые уже участвуют в рейсах
  // const res = driversData
  //   ?.filter((e) => e.car_type === "truck")
  //   .filter((d) => !tripsData.some((t) => d.name === t.driver.driver));
  // console.log(res);

  return (
    <div>
      <div className="flex flex-col">
        <span>Водитель: </span>
        <div className="flex justify-between">
          <b className="items-end">
            {currentTripData?.driver.driver +
              " | " +
              currentTripData?.driver.car +
              " - " +
              currentTripData?.driver.state_number}{" "}
          </b>
          <Button isIconOnly size="sm" color="default" onPress={onOpen}>
            <IoMdSettings />
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenModalChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {!isHireDriver ? (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Замена данных водителя
                  </ModalHeader>
                  <ModalBody>
                    <div>
                      Выберите водителя{" "}
                      {!driversLoading && (
                        <Autocomplete
                          onSelectionChange={(e) => setTripDriver(e.toString())}
                        >
                          {driversData
                            ?.filter((e) => e.car_type === "truck")
                            .map((dr) => (
                              <AutocompleteItem
                                key={`${dr.name}`}
                                textValue={`${dr.name}`}
                                value={`${dr.name}`}
                              >
                                {dr.name}
                              </AutocompleteItem>
                            ))}
                        </Autocomplete>
                      )}
                    </div>
                    <div>
                      Выберите машину
                      {!carLoading && (
                        <Autocomplete
                          onSelectionChange={(e) => setTripCar(e.toString())}
                        >
                          {carData
                            ?.filter((e) => e.car_type === "truck")
                            .map((c) => (
                              <AutocompleteItem
                                key={`${c.car + " - " + c.state_number}`}
                                textValue={`${c.car + " - " + c.state_number}`}
                                value={`${c.car + " - " + c.state_number}`}
                              >
                                {c.car + " - " + c.state_number}
                              </AutocompleteItem>
                            ))}
                        </Autocomplete>
                      )}
                    </div>
                  </ModalBody>
                </>
              ) : (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Добавить наёмного водителя
                  </ModalHeader>
                  <ModalBody>
                    Введите Ф.И.
                    <Input
                      variant="bordered"
                      placeholder="Иванов Иван"
                      onChange={(e) => setTripDriver(e.target.value)}
                    />
                    Введите машину и номер.
                    <div className="flex gap-4">
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
                  </ModalBody>
                </>
              )}

              <ModalFooter className="flex justify-between">
                <Button
                  color={!isHireDriver ? "primary" : "warning"}
                  onPress={() => {
                    !isHireDriver
                      ? setIsHireDriver(true)
                      : setIsHireDriver(false);
                  }}
                >
                  {!isHireDriver ? (
                    <span>Добавить наёмного водителя</span>
                  ) : (
                    <span>Добавить своего водителя</span>
                  )}
                </Button>

                <Button
                  color="success"
                  onPress={() => {
                    setDriverMutation();
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
