"use client";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";

import { toast } from "@/components/ui/use-toast";

import { ReactNode, useEffect, useState } from "react";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";

import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { setTripToNextWeek, updateTripStatus } from "../../../_api/requests";
import { TripInfoDriver } from "./TripInfoDriver";
import { TripInfoResponsibleUser } from "./TripInfoRespUser";
import { TripInfoNum } from "./TripInfoNum";
import { TripInfoMscCard } from "./TripMscInfoCard";
import { WHCargoModal } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";

import { TripInfoExchangeRate } from "./TripInfoExchangeRate";

import { FaAngleUp } from "react-icons/fa6";
import { useConfirmContext } from "@/tool-kit/hooks";
import { useParams, useRouter } from "next/navigation";
import { WeekTableType } from "../../../_api/types";
import { getPath } from "@/lib/consts/paths";
import { TripInfoPayHireDriver } from "./TripInfoPayHireDriver";

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
  const {
    slug,
  }: {
    slug: WeekTableType;
  } = useParams();

  const { data: allUsers } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => await getUserList(),
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

  const statusItems = [
    "Машина закрыта",
    "В пути",
    "Прибыл",
    "ВС",
    "ПН",
    "ВТ",
    "СР",
    "ЧТ",
    "ПТ",
    "СБ",
  ];
  const closedStatusItems = ["Машина закрыта", "В пути", "Прибыл"];
  const disclosure = useDisclosure();

  const router = useRouter();
  const { openModal } = useConfirmContext();
  const { mutate, isPending } = useMutation({
    mutationFn: setTripToNextWeek,
    onError: (err) => {
      toast({
        title: `${err}`,
      });
    },
    onSuccess: (data) => {
      router.push(
        getPath({
          params: {
            id: currentTripData.id,
            slug,
            weekId: data.id,
          },
        })
      );
    },
  });

  const handleUpdateWeek = () => {
    openModal({
      action: async () => {
        mutate({
          trip: currentTripData,
          weekType: slug as WeekTableType,
        });
      },
      isLoading: isPending,
      title: `Вы уверены что хотите перенести ${currentTripData.trip_number}й рейс в следующую неделю?`,
      buttonName: "Перенести",
    });
  };
  return (
    <>
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
            <TripInfoExchangeRate currentTripData={currentTripData} />
            <TripInfoDriver
              tripsData={tripsData}
              currentTripData={currentTripData}
              tripId={currentTripData?.id}
            />
            {currentTripData?.driver.hire && (
              <RoleBasedWrapper allowedRoles={["Админ", "Кассир"]}>
                <TripInfoPayHireDriver currentTripData={currentTripData} />
              </RoleBasedWrapper>
            )}

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
                          onPress={() => {
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
              </div>
            }
            <TripInfoMscCard
              selectedTabId={selectedTabId}
              tripsData={tripsData}
            />

            <div className="flex gap-2">
              <RoleBasedWrapper
                allowedRoles={["Зав.Склада", "Зав.Склада Москва", "Админ"]}
              >
                <Button
                  color="success"
                  onPress={disclosure.onOpenChange}
                  isDisabled={closedStatusItems.includes(
                    currentTripData?.status
                  )}
                  variant="flat"
                >
                  Добавить груз от лица Зав Склада
                </Button>
              </RoleBasedWrapper>
              <RoleBasedWrapper
                allowedRoles={["Зав.Склада", "Зав.Склада Москва"]}
                exclude={true}
              >
                <Button
                  color="success"
                  onPress={onOpenChange}
                  isDisabled={closedStatusItems.includes(
                    currentTripData?.status
                  )}
                >
                  Добавить груз
                </Button>
              </RoleBasedWrapper>
              <RoleBasedWrapper allowedRoles={["Админ"]}>
                <Tooltip content={"Перенести рейс в следующую неделю"}>
                  <Button
                    color="warning"
                    isIconOnly
                    onPress={() => handleUpdateWeek()}
                    isDisabled={closedStatusItems.includes(
                      currentTripData?.status
                    )}
                  >
                    <FaAngleUp />
                  </Button>
                </Tooltip>
              </RoleBasedWrapper>
            </div>
          </div>
        </CardBody>
      </Card>
      <WHCargoModal disclosure={disclosure} trip_id={currentTripData?.id} />
    </>
  );
};
