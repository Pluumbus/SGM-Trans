"use client";

import { useParams } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTripsByWeekId } from "../_api";
import {
  Button,
  Card,
  CardBody,
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
  return (
    <div className="flex flex-col gap-2">
      <span>
        Номер рейса: <b>{selectedTabId}</b>
      </span>
      <span>
        Водитель:
        <b>
          {tripsData.find((item) => item.id === Number(selectedTabId))?.driver}
        </b>
      </span>
      <div>
        <Button color="success" onClick={onOpenChange}>
          Добавить груз
        </Button>
      </div>
    </div>
  );
};

export default Page;
