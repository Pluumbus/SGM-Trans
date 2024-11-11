"use client";

import { UTable } from "@/tool-kit/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UpdateTripNumber } from "../UpdateTripNumber";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  UseTableColumnsSchema,
  UseTableConfig,
} from "@/tool-kit/ui/UTable/types";

import { getCargos } from "../../../_api";
import { useSelectionStore } from "../store";
import supabase from "@/utils/supabase/client";
import { BarGraph } from "../Statistics/BarGraph";
import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  MngrClientButton,
  MngrWrhButton,
} from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/[id]/_features/ManagerBtns/ManagerBtns";
import { SgmSpinner } from "@/components/ui/SgmSpinner";

export const TripTab = ({
  tripid,
  columns,
  isOnlyMycargos,
  onCargosUpdate,
}: {
  tripid: number;
  columns: UseTableColumnsSchema<CargoType>[];
  isOnlyMycargos: boolean;
  onCargosUpdate: (cities: string[]) => void;
}) => {
  const { data, isFetched } = useQuery({
    queryKey: [`cargo-${tripid}`],
    queryFn: async () => await getCargos(tripid.toString()),
    enabled: !!tripid,
  });

  const [cargos, setCargos] = useState<CargoType[]>(data || []);

  // const { mutate: getCargosMutation, isPending } = useMutation({
  //   mutationKey: [`cargos-${currentTrip.id}`],
  //   mutationFn: async () => await getCargos(currentTrip.id.toString()),
  //   onSuccess: (data) => setCargos(data),
  // });

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

  // useEffect(() => {
  //   getCargosMutation();
  // }, []);

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
      .channel(`workflow-trip${tripid}`)
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
                .filter((e) => e.trip_id == tripid);

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

  return (
    <>
      <UTable
        tBodyProps={{
          emptyContent: `Пока что в рейсе №${tripid} нет грузов`,
          isLoading: !isFetched,
          loadingContent: <SgmSpinner />,
        }}
        data={cargos}
        isPagiantion={false}
        columns={columns}
        name={`Cargo Table ${tripid}`}
        config={config}
      />

      {rowSelected?.some((e) => e.isSelected) && (
        <UpdateTripNumber currentTripId={tripid} />
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
