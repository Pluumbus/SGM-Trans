"use client";

import { UTable } from "@/tool-kit/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { UpdateTripNumber } from "../UpdateTripNumber";
import { TripType } from "@/app/workflow/_feature/TripCard/TripCard";
import { CargoType } from "@/app/workflow/_feature/types";
import {
  UseTableColumnsSchema,
  UseTableConfig,
} from "@/tool-kit/ui/UTable/types";

import { getCargos } from "../../../_api";
import { useSelectionStore } from "../store";
import supabase from "@/utils/supabase/client";
import { Button, Spinner } from "@nextui-org/react";
import { BarGraph } from "../Statistics/BarGraph";
import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  MngrClientButton,
  MngrWrhButton,
} from "@/app/workflow/[slug]/week/[weekId]/trip/[id]/_features/ManagerBtns/ManagerBtns";

export const TripTab = ({
  currentTrip,
  trips,
  columns,
  isOnlyMycargos,
  onCargosUpdate,
}: {
  currentTrip: TripType;
  trips: TripType[];
  columns: UseTableColumnsSchema<CargoType>[];
  isOnlyMycargos: boolean;
  onCargosUpdate: (cities: string[]) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [`cargo-${currentTrip.id}`],
    queryFn: async () => await getCargos(currentTrip.id.toString()),
    enabled: !!currentTrip,
  });
  const [cargos, setCargos] = useState<CargoType[]>(data || []);

  const { rowSelected, setRowSelected } = useSelectionStore();
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  const { user } = useUser();

  const filterBy = () =>
    isOnlyMycargos ? data.filter((e) => e.user_id == user.id.toString()) : data;

  useEffect(() => {
    if (data) {
      setRowSelected(
        data.map((e) => ({
          number: e.id,
          isSelected: false,
        }))
      );

      setCargos(filterBy());
    }
  }, [data, isOnlyMycargos]);

  useEffect(() => {
    onCargosUpdate(data?.map((cargo) => cargo.unloading_point.city));
  }, [data]);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-trip${currentTrip.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cargos",
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            setCargos((prev) => [...prev, payload.new as CargoType]);
          } else {
            setCargos((prev) => {
              const res = prev
                .map((e) =>
                  e.id === payload.old.id
                    ? (payload.new as CargoType)
                    : (e as CargoType)
                )
                .filter((e) => e.trip_id == currentTrip.id);
              return res;
            });
            const rowsToSelect = cargos.map((e) => ({
              number: e.id,
              isSelected: false,
            }));

            setRowSelected(rowsToSelect);
          }
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <UTable
        tBodyProps={{
          emptyContent: `Пока что в рейсе №${currentTrip.id} нет грузов`,
        }}
        data={cargos}
        isPagiantion={false}
        columns={columns}
        name={`Cargo Table ${currentTrip.id}`}
        config={config}
      />

      {rowSelected?.some((e) => e.isSelected) && (
        <UpdateTripNumber currentTripId={currentTrip.id} trips={trips} />
      )}
      {cargos.length > 0 && (
        <div className="flex justify-between">
          <MngrClientButton cargos={cargos} />
          <MngrWrhButton cargos={cargos} />
        </div>
      )}
      <div className="mb-8"></div>
      <BarGraph cargos={cargos} />
      <div className="mb-8"></div>
    </>
  );
};
