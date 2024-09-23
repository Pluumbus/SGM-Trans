"use client";

import { UTable } from "@/tool-kit/ui";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getBaseColumnsConfig } from "./_features/_Table/CargoTable.config";
import { CargoType } from "@/app/workflow/_feature/types";
import { useQuery } from "@tanstack/react-query";
import { getCargos, getTripsByWeekId } from "../_api";
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
import supabase from "@/utils/supabase/client";
import { NextPage } from "next";
import { Timer } from "@/components/timeRecord/timeRecord";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { BarGraph } from "./_features/Statistics/BarGraph";
import RoleBasedWrapper from "@/components/roles/RoleBasedRedirect";

const Page: NextPage = () => {
  const { weekId, id } = useParams() as {
    weekId: string;
    id: string;
  };
  const columns = useMemo(() => getBaseColumnsConfig(), []);
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };
  const [selectedTabId, setSelectedTabId] = useState(id);

  const { data: tripsData, isLoading: tripsLoading } = useQuery<TripType[]>({
    queryKey: ["trips"],
    queryFn: async () => await getTripsByWeekId(weekId),
  });

  const [trips, setTrips] = useState<TripType[]>(tripsData || []);
  const { data, isLoading, isFetched, refetch } = useQuery<any, CargoType[]>({
    queryKey: [`cargos/trip/${selectedTabId}`],
    queryFn: async () => await getCargos(selectedTabId),
  });

  const [cargos, setCargos] = useState<CargoType[]>(data || []);

  useEffect(() => {
    if (!isLoading && !tripsLoading) {
      setCargos(data);
      setTrips(tripsData);
      console.log("Cargos: ", data);
    }
  }, [isLoading, tripsLoading, selectedTabId]);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-trip${selectedTabId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cargos",
          filter: `trip_selectedTabId=eq.${selectedTabId}`,
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            setCargos((prev) => [...prev, payload.new as CargoType]);
          } else {
            const res = cargos.map((e) => {
              if (e.id === payload.old.selectedTabId) {
                return payload.new;
              }
              return e;
            }) as CargoType[];
            setCargos(res);
          }
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  });

  const { isOpen, onOpenChange } = useDisclosure();

  // if (isLoading) {
  //   return <Spinner />;
  // }

  const handleSelectTab = (key) => {
    setSelectedTabId(key);
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between">
        <Card className="bg-gray-200 w-72">
          <CardBody>
            <div className="flex flex-col gap-2">
              <span>
                Номер рейса: <b>{selectedTabId}</b>
              </span>
              <span>
                Водитель:
                <b>
                  {
                    trips.find((item) => item.id === Number(selectedTabId))
                      ?.driver
                  }
                </b>
              </span>
              <div>
                <Button color="success" onClick={onOpenChange}>
                  Добавить груз
                </Button>
              </div>
            </div>
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
          onSelectionChange={handleSelectTab}
        >
          {trips.map((trip) => (
            <Tab key={trip.id} title={trip.id}>
              {!isLoading && isFetched ? (
                <>
                  <UTable
                    data={cargos}
                    columns={columns}
                    name="Cargo Table"
                    config={config}
                  />
                  <div className="mb-8"></div>
                  <BarGraph cargos={cargos} />
                  <div className="mb-8"></div>
                </>
              ) : (
                <Spinner />
              )}
            </Tab>
          ))}
        </Tabs>
        {/* <Card className="bg-gray-200">
            <CardBody>
              <span className="flex justify-center">Рейсы недели</span>
              <div className="flex ">
                {trips.map((trip) => (
                  <Link
                    className="ml-1 "
                    color="primary"
                    key={trip.id}
                    href={`/workflow/${slug}/week/${weekId}/trip/${trip.id}`}
                  >
                    <Button color="warning" size="sm">
                      <b>{trip.id}</b>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card> */}
      </div>

      {/* </div> */}
      {/* <UTable
        data={cargos}
        columns={columns}
        name="Cargo Table"
        config={config}
      /> */}
      {/* <div className="mb-8"></div>
      <BarGraph cargos={cargos} />
      <div className="mb-8"></div> */}
      <CargoModal
        isOpenCargo={isOpen}
        onOpenChangeCargo={onOpenChange}
        trip_id={Number(selectedTabId)}
      />
    </div>
  );
};

export default Page;
