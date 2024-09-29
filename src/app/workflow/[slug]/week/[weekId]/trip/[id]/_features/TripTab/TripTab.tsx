"use client";

import { UTable } from "@/tool-kit/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { Spinner } from "@nextui-org/react";
import { BarGraph } from "../Statistics/BarGraph";

export const TripTab = ({
  currentTrip,
  trips,
  columns,
}: {
  currentTrip: TripType;
  trips: TripType[];
  columns: UseTableColumnsSchema<CargoType>[];
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

  useEffect(() => {
    if (data) {
      setCargos(data);
      const res = data.map((e) => ({
        number: e.id,
        isSelected: false,
      }));
      setRowSelected(res);
    }
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
            const temp = cargos.map((e) => {
              if (e.id === payload.old.id) {
                return payload.new;
              }
              return e;
            }) as CargoType[];

            const res = temp.filter((e) => e.trip_id == currentTrip.id);
            const rowsToSelect = temp.map((e) => ({
              number: e.id,
              isSelected: false,
            }));

            setRowSelected(rowsToSelect);

            setCargos(res);
          }
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <UTable
        data={cargos}
        isPagiantion={false}
        columns={columns}
        name={`Cargo Table ${currentTrip.id}`}
        config={config}
      />

      {rowSelected?.some((e) => e.isSelected) && (
        <UpdateTripNumber
          cargos={cargos}
          trips={trips}
          selectedRows={rowSelected}
        />
      )}

      <div className="mb-8"></div>
      <BarGraph cargos={cargos} />
      <div className="mb-8"></div>
    </>
  );
};
