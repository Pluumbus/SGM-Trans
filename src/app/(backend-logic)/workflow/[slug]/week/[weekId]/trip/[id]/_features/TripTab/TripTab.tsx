"use client";

import { UTable } from "@/tool-kit/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UpdateTripNumber } from "../UpdateTripNumber";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  UseTableColumnsSchema,
  UseTableConfig,
} from "@/tool-kit/ui/UTable/types";

import { getCargos } from "../../../_api";
import supabase from "@/utils/supabase/client";
import { BarGraph } from "../Statistics/BarGraph";
import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  MngrAccButton,
  MngrMscButton,
  MngrWrhButton,
} from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/[id]/_features/ManagerBtns/ManagerBtns";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { DeleteCargo } from "../DeleteCargo";
import { useSelectionContext } from "../Contexts";
import { groupCargosByCity } from "@/app/(backend-logic)/workflow/_feature/WeekCard/helpers";
import { WHCargoTable } from "../_Table/WHCargoTable";
import { getSchema } from "@/utils/supabase/getSchema";

export const TripTab = ({
  trip,
  columns,
  isOnlyMycargos,
  onCargosUpdate,
}: {
  trip: TripType;
  columns: UseTableColumnsSchema<CargoType>[];
  isOnlyMycargos: boolean;
  onCargosUpdate: (cities: string[], cargos: CargoType[]) => void;
}) => {
  // const { data, isFetched, isLoading } = useQuery({
  //   queryKey: [`cargo-${trip.id}`],
  //   queryFn: async () => await getCargos(trip.id.toString()),
  //   enabled: !!trip.id,
  // });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: [`cargo-${trip.id}`],
    mutationFn: async () => await getCargos(trip.id.toString()),
    onSuccess: (data) => {
      setCargos(data);
    },
  });
  const [cargos, setCargos] = useState<CargoType[]>();
  const [rowSelected, setRowSelected] = useSelectionContext();

  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  const { user } = useUser();

  const filterBy = () =>
    isOnlyMycargos
      ? cargos.filter((e) => e.user_id == user.id.toString())
      : cargos;

  useEffect(() => {
    if (cargos) {
      setRowSelected(
        cargos.map((e) => ({
          number: e.id,
          isSelected: false,
        }))
      );

      setCargos(filterBy());
    }
  }, [cargos, isOnlyMycargos]);

  useEffect(() => {
    onCargosUpdate(
      cargos?.map((cargo) => cargo.unloading_point.city),
      cargos
    );
  }, [cargos]);

  useEffect(() => {
    mutate();
  }, []);
  useEffect(() => {
    const cn = supabase
      .channel(`workflow-trip${trip.id}-${user?.id!}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: getSchema(),
          table: "cargos",
        },
        (payload) => {
          if (payload.eventType !== "UPDATE") {
            const newCargo = payload.new as CargoType;
            setCargos((prev) => [...prev, newCargo]);
            setRowSelected((prev) => [
              ...prev,
              { number: newCargo.id, isSelected: false },
            ]);
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

            const rowsToSelect = cargos?.map((e) => ({
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

  const getSortedCargos = () => {
    const priorityCities = ["Астана", "Алмата", "Караганда"];
    return cargos?.sort((a, b) => {
      const cityA = a.unloading_point?.city || "";
      const cityB = b.unloading_point?.city || "";

      const indexA = priorityCities.indexOf(cityA);
      const indexB = priorityCities.indexOf(cityB);

      const finalIndexA = indexA === -1 ? Infinity : indexA;
      const finalIndexB = indexB === -1 ? Infinity : indexB;

      if (finalIndexA < finalIndexB) return -1;
      if (finalIndexA > finalIndexB) return 1;

      return cityA.localeCompare(cityB);
    });
  };
  const citiesData = groupCargosByCity(getSortedCargos());
  if (isPending)
    return (
      <div className="flex justify-center items-center">
        <SgmSpinner />
      </div>
    );
  return (
    <>
      {cargos?.length > 0 && (
        <Button
          variant="ghost"
          onPress={() => {
            const formattedText = cargos
              ?.filter((e) => e.client_bin.xin || e.client_bin.tempText)
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
              description: `Информация о ${cargos?.length} клиент(ах) была скопирована`,
            });
          }}
        >
          Скопировать всех клиентов
        </Button>
      )}
      <div className="my-8">
        <WHCargoTable trip={trip} />
      </div>

      <div className="space-y-4">
        {citiesData.map((e) => (
          <div>
            <span className="text-2xl font-semibold pl-4">{e.city}</span>
            <Divider />
            <UTable
              tBodyProps={{
                emptyContent: `Пока что в рейсе №${trip.trip_number} нет грузов`,
                isLoading: isPending,
                loadingContent: <Spinner />,
              }}
              data={e.cargos}
              isPagiantion={false}
              columns={columns}
              name={`Cargo Table ${trip.id}`}
              config={config}
            />
          </div>
        ))}
      </div>

      {rowSelected?.some((e) => e.isSelected) && (
        <div className="my-2 flex gap-2">
          <UpdateTripNumber currentTripId={trip.trip_number} />
          <DeleteCargo />
        </div>
      )}
      {cargos?.length > 0 && (
        <div className="flex justify-between">
          <MngrAccButton cargos={cargos} />
          <MngrMscButton cargos={cargos} />
          <MngrWrhButton cargos={cargos} />
        </div>
      )}
      <div className="mb-8"></div>
      <BarGraph cargos={cargos} />
      <div className="mb-8"></div>
    </>
  );
};
