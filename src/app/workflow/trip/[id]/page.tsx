"use client";

import { UTable } from "@/tool-kit/ui";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getBaseColumnsConfig } from "./_features/_Table/CargoTable.config";
import { CargoType } from "@/app/workflow/_feature/types";
import { useQuery } from "@tanstack/react-query";
import { getCargos, getTripsByWeekId } from "../_api";
import { Button, Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { CargoModal } from "@/app/workflow/_feature";
import supabase from "@/utils/supabase/client";
import { NextPage } from "next";
import { Timer } from "@/components/timeRecord/timeRecord";
import RoleBasedRedirect from "@/components/roles/RoleBasedRedirect";
import { useUser } from "@clerk/nextjs";

const Page: NextPage = () => {
  const { id } = useParams() as { id: string };
  const columns = useMemo(() => getBaseColumnsConfig(), []);
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  const { data, isLoading } = useQuery<any, CargoType[]>({
    queryKey: ["cargos"],
    queryFn: async () => await getCargos(id),
  });

  const [cargos, setCargos] = useState<CargoType[]>(data || []);

  useEffect(() => {
    if (!isLoading) {
      console.log("Cargos: ", data);

      setCargos(data);
    }
  }, [isLoading]);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-trip${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cargos",
          filter: `trip_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            setCargos((prev) => [...prev, payload.new as CargoType]);
          } else {
            const res = cargos.map((e) => {
              if (e.id === payload.old.id) {
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

  const [showTimer, setShowTimer] = useState(false);
  const { user, isLoaded } = useUser();
  const handleToggleTimer = () => {
    setShowTimer((prevShowTimer) => !prevShowTimer);
  };
  const handleStopTimer = () => {
    setShowTimer(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const { data: trips, isLoading: tripsLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => await getTripsByWeekId(id),
  });
  const tempArr = ["Рейс 1", "Рейс 2", "Рейс 3"];
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <span>Номер рейса: {id}</span>

          <div>
            <Button onClick={onOpenChange}>Добавить груз</Button>
          </div>
        </div>
        <div>
          <Tabs aria-label="Options">
            {tempArr.map((t) => (
              <Tab key={t} title={t}>
                {t}
              </Tab>
            ))}
          </Tabs>
        </div>
        <RoleBasedRedirect allowedRoles={["Админ", "Логист Дистант"]}>
          {showTimer ? (
            <Timer onStop={handleStopTimer} />
          ) : (
            <Button color="primary" onClick={handleToggleTimer}>
              {isLoaded && (user!.publicMetadata?.time as number) != 0
                ? "Продолжить работу"
                : "Начать работу"}
            </Button>
          )}
        </RoleBasedRedirect>
      </div>

      <UTable
        data={cargos}
        columns={columns}
        name="Cargo Table"
        config={config}
      />
      <CargoModal
        isOpenCargo={isOpen}
        onOpenChangeCargo={onOpenChange}
        trip_id={Number(id)}
      />
    </div>
  );
};

export default Page;
