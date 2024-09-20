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
  Link,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import supabase from "@/utils/supabase/client";
import { NextPage } from "next";
import { Timer } from "@/components/timeRecord/timeRecord";
import RoleBasedRedirect from "@/components/roles/RoleBasedRedirect";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { BarGraph } from "./_features/Statistics/BarGraph";

const Page: NextPage = () => {
  const { weekId, id, slug } = useParams() as {
    weekId: string;
    id: string;
    slug: string;
  };
  const columns = useMemo(() => getBaseColumnsConfig(), []);
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };
  const [selectedTabId, setSelectedTabId] = useState(id);

  const { data, isLoading, refetch } = useQuery<any, CargoType[]>({
    queryKey: ["cargos"],
    queryFn: async () => await getCargos(selectedTabId),
  });

  const { data: tripsData, isLoading: tripsLoading } = useQuery<TripType[]>({
    queryKey: ["trips"],
    queryFn: async () => await getTripsByWeekId(weekId),
  });

  const [cargos, setCargos] = useState<CargoType[]>(data || []);
  const [trips, setTrips] = useState<TripType[]>(tripsData || []);
  useEffect(() => {
    if (!isLoading && !tripsLoading) {
      console.log("Cargos: ", data);

      setCargos(data);
      setTrips(tripsData);
    }
  }, [isLoading, tripsLoading]);

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

  if (isLoading) {
    return <Spinner />;
  }

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
        <div className="flex flex-col">
          <Card className=" bg-gray-200">
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
          </Card>
        </div>
        <RoleBasedRedirect allowedRoles={["Админ", "Логист Дистант"]}>
          <Timer />
        </RoleBasedRedirect>
      </div>
      <UTable
        data={cargos}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
      <div className="mb-8"></div>
      <BarGraph cargos={cargos} />
      <div className="mb-8"></div>
      <CargoModal
        isOpenCargo={isOpen}
        onOpenChangeCargo={onOpenChange}
        trip_id={Number(selectedTabId)}
      />
    </div>
  );
};

export default Page;
