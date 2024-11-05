"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";

import { toast } from "@/components/ui/use-toast";

import { ReactNode, useEffect, useState } from "react";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";
import { getUserById } from "../../../_api";
import { UsersList } from "@/lib/references/clerkUserType/types";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import {
  updateTripDriver,
  updateTripRespUser,
  updateTripStatus,
} from "../../../_api/requests";
import { useCheckRole } from "@/components/roles/useRole";
import { daysOfWeek } from "../../_helpers";
import { getCars, getDrivers } from "@/lib/references/drivers/feature/api";
import { SgmSpinner } from "@/components/ui/SgmSpinner";

export const TripInfoCard = ({
  selectedTabId,
  tripsData,
  onOpenChange,
}: {
  selectedTabId: ReactNode;
  tripsData: TripType[];
  onOpenChange: () => void;
}) => {
  const [currentTripData, setCurrentTripData] = useState<TripType>();
  const [statusVal, setStatusVal] = useState<string | undefined>();

  const accessRole = useCheckRole(["Логист Москва", "Админ"]);

  const { data: allUsers } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => {
      const users = await getUserList();
      const filteredUsrs = users.filter((user) => user.role === "Логист");
      return filteredUsrs as UsersList[];
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`GetResponsibleUsersNames`],
    queryFn: async () => {
      const namesList = await Promise.all(
        tripsData.map(async (trip) => {
          const fullName = await getUserById(trip.user_id);
          const tripId = trip.id;
          return { tripId, fullName };
        })
      );
      return namesList;
    },
  });

  const { mutate: setStatusMutation } = useMutation({
    mutationKey: ["setTripStatus"],
    mutationFn: async () => await updateTripStatus(statusVal, selectedTabId),
    onSuccess() {
      toast({
        title: "Статус рейса успешно обновлён",
      });
    },
  });

  useEffect(() => {
    const currentTrip = tripsData.find(
      (item) => item.id === Number(selectedTabId)
    );
    setCurrentTripData(currentTrip);
    setStatusVal(currentTrip?.status);
    refetch();
  }, [selectedTabId, tripsData]);

  const respUser = data?.filter(
    (user) => user.tripId === currentTripData?.id
  )[0]?.fullName;

  return (
    <Card className="bg-gray-200 w-72">
      <CardBody>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span>Номер рейса:</span>
            <b>{selectedTabId}</b>
          </div>

          <TripInfoResponsibleUser
            selectedTabId={Number(selectedTabId)}
            isLoading={isLoading}
            respUser={respUser}
            allUsers={allUsers}
          />
          <TripInfoDriver
            currentTripData={currentTripData}
            selectedTabId={Number(selectedTabId)}
          />

          <div className="flex justify-between">
            <span>Статус:</span>
            <b>{statusVal}</b>
            {
              <div>
                {accessRole ? (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" color="default">
                        <IoMdSettings />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {["Машина закрыта", "В пути", "Прибыл"].map(
                        (stat: string) => (
                          <DropdownItem
                            key={stat}
                            onClick={() => {
                              setStatusVal(stat);
                              setStatusMutation();
                            }}
                          >
                            {stat}
                          </DropdownItem>
                        )
                      )}
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Dropdown isDisabled={!daysOfWeek.includes(statusVal)}>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" color="default">
                        <IoMdSettings />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {daysOfWeek.map((stat: string) => (
                        <DropdownItem
                          key={stat}
                          onClick={() => {
                            setStatusVal(stat);
                            setStatusMutation();
                          }}
                        >
                          {stat}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            }
          </div>
          <div>
            <Button color="success" onClick={onOpenChange}>
              Добавить груз
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const TripInfoResponsibleUser = ({
  selectedTabId,
  isLoading,
  respUser,
  allUsers,
}: {
  selectedTabId: number;
  isLoading: boolean;
  respUser: { firstName: string; lastName: string };
  allUsers: UsersList[];
}) => {
  const { mutate: setTripUserMutation } = useMutation({
    mutationKey: ["SetTripRespUser"],
    mutationFn: async (user_id: string) =>
      await updateTripRespUser(user_id, selectedTabId),
    onSuccess() {
      toast({
        title: "Ответственный рейса успешно обновлён",
      });
    },
  });
  return (
    <div className="flex justify-between">
      <span>Ответственный:</span>
      <b>{isLoading ? <Spinner /> : respUser?.firstName}</b>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" color="default">
            <IoMdSettings />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Select dropdown">
          {allUsers?.map((user) => (
            <DropdownItem
              key={user.id}
              onClick={() => setTripUserMutation(user.id)}
            >
              {user.userName}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const TripInfoDriver = ({
  currentTripData,
  selectedTabId,
}: {
  currentTripData: TripType;
  selectedTabId: number;
}) => {
  const [tripDriver, setTripDriver] = useState(currentTripData?.driver);
  const [tripCar, setTripCar] = useState("");

  const { isOpen, onOpen, onOpenChange: onOpenModalChange } = useDisclosure();

  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["getAllDrivers"],
    queryFn: getDrivers,
  });

  const { data: carData, isLoading: carLoading } = useQuery({
    queryKey: ["getAllCars"],
    queryFn: getCars,
  });

  const { mutate: setDriverMutation } = useMutation({
    mutationKey: ["setTripStatus"],
    mutationFn: async () =>
      await updateTripDriver(tripDriver + " | " + tripCar, selectedTabId),
    onSuccess() {
      toast({
        title: "Водитель рейса успешно обновлён",
      });
    },
  });
  console.log(tripCar, tripDriver);
  return (
    <div>
      <div className="flex flex-col">
        <span>Водитель: </span>
        <div className="flex justify-between">
          <b className="items-end">{currentTripData?.driver} </b>
          <Button isIconOnly size="sm" color="default" onPress={onOpen}>
            <IoMdSettings />
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenModalChange}>
        <ModalContent>
          {(onClose) => (
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
              <ModalFooter>
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
