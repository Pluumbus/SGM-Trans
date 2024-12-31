"use client";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import { toast } from "@/components/ui/use-toast";

import { ReactNode, useEffect, useState } from "react";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";
import { UsersList } from "@/lib/references/clerkUserType/types";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { updateTripStatus } from "../../../_api/requests";
import { TripInfoDriver } from "./TripInfoDriver";
import { TripInfoResponsibleUser } from "./TripInfoRespUser";
import { TripInfoNum } from "./TripInfoNum";
import { TripInfoMscCard } from "./TripMscInfoCard";

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

  const { data: allUsers } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => {
      const users = await getUserList();
      const filteredUsrs = users.filter(
        (user) =>
          user.role === "Логист" ||
          user.role === "Логист Дистант" ||
          user.role === "Логист Москва"
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
      (item) => item.id === Number(selectedTabId)
    );
    setCurrentTripData(currentTrip);
    setStatusVal(currentTrip?.status);
  }, [selectedTabId, tripsData]);

  const respUser = allUsers?.filter(
    (user) => user.id === currentTripData?.user_id
  )[0]?.userName;

  const statusItems = ["Машина закрыта", "В пути", "Прибыл"];
  return (
    <Card className="bg-gray-200 w-[28rem]">
      <CardBody>
        <div className="flex flex-col gap-2">
          <TripInfoResponsibleUser
            tripId={currentTripData?.id}
            respUser={respUser}
            allUsers={allUsers}
          />
          <TripInfoNum
            id={Number(selectedTabId)}
            tempId={currentTripData?.trip_number}
          />
          <TripInfoDriver
            tripsData={tripsData}
            currentTripData={currentTripData}
            tripId={currentTripData?.id}
          />

          {
            <div>
              <div className="flex justify-between">
                <span>Статус:</span>
                <b>{statusVal}</b>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" color="default">
                      <IoMdSettings />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {statusItems.map((stat: string) => (
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
              </div>
              {/* {accessRole ? (
                <div className="flex justify-between">
                  <span>Статус:</span>
                  <b>{statusVal}</b>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" color="default">
                        <IoMdSettings />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {statusItems.map((stat: string) => (
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
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>
                    {statusItems.includes(statusVal)
                      ? "Статус:"
                      : "День недели:"}
                  </span>
                  <b>{statusVal}</b>
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
                </div>
              )} */}
            </div>
          }
          <TripInfoMscCard
            selectedTabId={selectedTabId}
            tripsData={tripsData}
          />

          <div>
            <Button color="success" onPress={onOpenChange}>
              Добавить груз
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
