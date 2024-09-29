"use client";

import { useParams } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTripsByWeekId } from "../_api";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  DatePicker,
  DateValue,
  Input,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import RoleBasedWrapper from "@/components/roles/RoleBasedRedirect";
import { Timer } from "@/components/Timer/Timer";
import { TripTab } from "./_features/TripTab";
import { NextPage } from "next";
import { getBaseColumnsConfig } from "./_features/_Table/CargoTable.config";
import { checkRole, useRole } from "@/components/roles/useRole";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { updateTripStatus } from "../_api/requests";

const Page: NextPage = () => {
  const { weekId, id } = useParams<{
    weekId: string;
    id: string;
  }>();

  const [selectedTabId, setSelectedTabId] = useState(id);

  const { data: tripsData, isLoading } = useQuery<TripType[]>({
    queryKey: ["getTrips"],
    queryFn: async () => await getTripsByWeekId(weekId),
  });

  const { isOpen, onOpenChange } = useDisclosure();

  const columns = useMemo(() => getBaseColumnsConfig(), []);

  const handleSelectTab = (key) => {
    setSelectedTabId(key);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex justify-between">
        <Card className="bg-gray-200 w-72">
          <CardBody>
            <TripInfoCard
              onOpenChange={onOpenChange}
              selectedTabId={selectedTabId}
              tripsData={tripsData}
            />
          </CardBody>
        </Card>
        <RoleBasedWrapper allowedRoles={["Админ", "Логист Дистант"]}>
          <Timer />
        </RoleBasedWrapper>
      </div>
      <div className="flex flex-col ">
        <span className="flex justify-center">Рейсы недели</span>
        <Tabs
          className="flex justify-center"
          aria-label="Trips"
          defaultSelectedKey={selectedTabId}
          onSelectionChange={(key) => handleSelectTab(key)}
        >
          {tripsData.map((trip) => (
            <Tab title={trip.id.toString()} key={trip.id}>
              <TripTab currentTrip={trip} trips={tripsData} columns={columns} />
            </Tab>
          ))}
        </Tabs>
      </div>
      <CargoModal
        isOpenCargo={isOpen}
        onOpenChangeCargo={onOpenChange}
        trip_id={Number(selectedTabId)}
      />
    </div>
  );
};

const TripInfoCard = ({
  selectedTabId,
  tripsData,
  onOpenChange,
}: {
  selectedTabId: ReactNode;
  tripsData: TripType[];
  onOpenChange: () => void;
}) => {
  const currentTripData = tripsData.find(
    (item) => item.id === Number(selectedTabId)
  );

  const [statusVal, setStatusVal] = useState<string | undefined>(
    currentTripData?.status
  );
  const { mutate: setStatusMutation } = useMutation({
    mutationKey: ["SetTripStatus"],
    mutationFn: async () => await updateTripStatus(statusVal, selectedTabId),
    onSuccess() {
      toast({
        title: "Статус рейса успешно обновлён",
      });
    },
  });
  const accessCheck = checkRole(["Супер Логист", "Админ"]);
  const handleDateChange = (date: DateValue | null) => {
    const dateStr = new Date(
      date.year,
      date.month - 1,
      date.day
    ).toLocaleDateString();
    setStatusVal(dateStr);
    setStatusMutation();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span>Номер рейса:</span>
        <b>{selectedTabId}</b>
      </div>
      <div className="flex justify-between">
        <span>Водитель: </span>
        <b className="items-end">{currentTripData?.driver}</b>
      </div>

      <div className="flex justify-between">
        Статус:{" "}
        {accessCheck ? (
          statusVal === "Выбрать дату" ? (
            <DatePicker aria-label="Выбрать дату" onChange={handleDateChange} />
          ) : (
            <Autocomplete
              variant="underlined"
              onInputChange={setStatusVal}
              inputValue={statusVal}
            >
              {["Выбрать дату", "В пути", "Машина закрыта"].map(
                (stat: string) => (
                  <AutocompleteItem key={stat}>{stat}</AutocompleteItem>
                )
              )}
            </Autocomplete>
          )
        ) : (
          <b>{statusVal}</b>
        )}
      </div>

      <div>
        <Button color="success" onClick={onOpenChange}>
          Добавить груз
        </Button>
      </div>
    </div>
  );
};

export default Page;
