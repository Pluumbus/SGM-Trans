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
import { useCheckRole } from "@/components/RoleManagment/useRole";
import { daysOfWeek } from "../../_helpers";
import { getCars, getDrivers } from "@/lib/references/drivers/feature/api";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { TripInfoDriver } from "./TripInfoDriver";
import { TripInfoResponsibleUser } from "./TripInfoRespUser";
import { TripInfoNum } from "./TripInfoNum";

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
      const filteredUsrs = users.filter(
        (user) => user.role === "Логист" || user.role === "Логист Дистант"
      );
      return filteredUsrs as UsersList[];
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
      (item) => item.trip_number === Number(selectedTabId)
    );
    setCurrentTripData(currentTrip);
    setStatusVal(currentTrip?.status);
  }, [selectedTabId, tripsData]);

  const respUser = allUsers?.filter(
    (user) => user.id === currentTripData?.user_id
  )[0]?.userName;
  return (
    <Card className="bg-gray-200 w-72">
      <CardBody>
        <div className="flex flex-col gap-2">
          <TripInfoResponsibleUser
            selectedTabId={Number(selectedTabId)}
            respUser={respUser}
            allUsers={allUsers}
          />
          <TripInfoNum
            id={currentTripData?.id}
            tempId={Number(selectedTabId)}
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
