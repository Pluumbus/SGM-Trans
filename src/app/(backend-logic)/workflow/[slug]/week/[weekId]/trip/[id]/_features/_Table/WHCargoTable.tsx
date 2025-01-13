"use client";
import { WHCargoType } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal/WHcargo/types";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { WHSchema } from "@/components/RoleManagment/RoleBasedSchema";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { UTable } from "@/tool-kit/ui";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getWHCargos } from "../../../_api";
import { TableModeProvider } from "./TableMode.context";
import { Divider, Spinner } from "@nextui-org/react";
import supabase from "@/utils/supabase/client";
import { getSchema } from "@/utils/supabase/getSchema";

export const WHCargoTable = ({ trip }: { trip: TripType }) => {
  const {
    data: whCargos,
    isLoading,
    isFetched,
    isSuccess,
  } = useQuery({
    queryKey: [`wh-cargos-${trip.id}`],
    queryFn: async () => await getWHCargos(trip.id.toString()),
    enabled: !!trip.id,
  });
  const [cargos, setCargos] = useState<WHCargoType[]>([]);

  const config: UseTableConfig<WHCargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  useEffect(() => {
    if (isSuccess) {
      setCargos(whCargos.filter((e) => !e.is_deleted));
    }
  }, [isSuccess]);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-trip${trip.id}-wh_cargos`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: getSchema(),
          table: "wh_cargos",
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            setCargos((prev) => {
              return [...prev, payload.new as WHCargoType];
            });
          } else {
            setCargos((prev) => {
              const res = prev
                .map((e) =>
                  e.id === payload.old.id
                    ? (payload.new as WHCargoType)
                    : (e as WHCargoType)
                )
                .filter((e) => e.trip_id == trip.id && !e.is_deleted);

              return res;
            });
          }
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (cargos.length == 0) {
    return null;
  }

  if (isPending)
    return (
      <div className="flex justify-center items-center">
        <SgmSpinner />
      </div>
    );
  return (
    <div className="">
      <span className="text-2xl font-semibold pl-4">
        Грузы добавленные Зав. Складом
      </span>
      <Divider />
      {!isLoading && isFetched && isSuccess && (
        <TableModeProvider mode="wh-cargo">
          <UTable
            tBodyProps={{
              emptyContent: `Пока что в рейсе нет добавленных зав складом`,
              isLoading: isLoading,
              loadingContent: <SgmSpinner />,
            }}
            data={cargos}
            isPagiantion={false}
            //   @ts-ignore
            columns={WHSchema()}
            name={`Cargo Table ${trip.id}`}
            config={config}
          />
        </TableModeProvider>
      )}
    </div>
  );
};
