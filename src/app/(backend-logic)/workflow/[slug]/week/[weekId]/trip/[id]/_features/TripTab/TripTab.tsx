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
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { Button } from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";

export const TripTab = ({
  trip,
  columns,
  isOnlyMycargos,
  onCargosUpdate,
}: {
  trip: TripType;
  columns: UseTableColumnsSchema<CargoType>[];
  isOnlyMycargos: boolean;
  onCargosUpdate: (cities: string[]) => void;
}) => {
  const { data, isFetched } = useQuery({
    queryKey: [`cargo-${trip.id}`],
    queryFn: async () => await getCargos(trip.id.toString()),
    enabled: !!trip.id,
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
      .channel(`workflow-trip${trip.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cargos",
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            setCargos((prev) => {
              setRowSelected((prevv) => [
                ...prevv,
                { number: (payload.new as CargoType)!.id, isSelected: false },
              ]);

              return [...prev, payload.new as CargoType];
            });
          } else {
            setCargos((prev) => {
              const res = prev
                .map((e) =>
                  e.id === payload.old.id
                    ? (payload.new as CargoType)
                    : (e as CargoType)
                )
                .filter((e) => e.trip_id == trip.id && !e.is_deleted);

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

  const { toast } = useToast();
  const [text, copy] = useCopyToClipboard();

  return (
    <>
      {cargos.length > 0 && (
        <Button
          variant="ghost"
          onClick={() => {
            const formattedText = cargos
              .filter((e) => e.client_bin.xin || e.client_bin.tempText)
              .map((e) => {
                const snts = e.client_bin.snts
                  .filter((el) => el !== "KZ-SNT-")
                  .join("");

                return `${e.client_bin.tempText || ""}\nБИН: ${e.client_bin.xin || ""}\n${snts}`.trim();
              })
              .join("\n\n");

            copy(formattedText);
            toast({
              title: "Скопировано в буфер обмена",
              description: `Информация о ${cargos.length} клиент(ах) была скопирована`,
            });
          }}
        >
          Скопировать всех клиентов
        </Button>
      )}
      <UTable
        tBodyProps={{
          emptyContent: `Пока что в рейсе №${trip.trip_number} нет грузов`,
          isLoading: !isFetched,
          loadingContent: <SgmSpinner />,
        }}
        data={cargos.sort((a, b) =>
          // a.client_bin.tempText.localeCompare(b.client_bin.tempText)
          a.unloading_point.city.localeCompare(b.unloading_point.city)
        )}
        isPagiantion={false}
        columns={columns}
        name={`Cargo Table ${trip.id}`}
        config={config}
      />

      {rowSelected?.some((e) => e.isSelected) && (
        <UpdateTripNumber currentTripId={trip.trip_number} />
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
