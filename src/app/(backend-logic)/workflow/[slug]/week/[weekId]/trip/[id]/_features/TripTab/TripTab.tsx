"use client";

import { UTable } from "@/tool-kit/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  AllManagerButtons,
  ExportToExcel,
} from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/[id]/_features/ManagerBtns/ManagerBtns";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { Button, Divider, Spinner, useDisclosure } from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { DeleteCargo } from "../DeleteCargo";
import {
  useCargosField,
  useCargosVisibility,
  useSelectionContext,
} from "../Contexts";
import { groupCargosByCity } from "@/app/(backend-logic)/workflow/_feature/WeekCard/helpers";
import { WHCargoTable } from "../_Table/WHCargoTable";
import { getSchema } from "@/utils/supabase/getSchema";
import { CargoTableProvider } from "../Contexts/CargoTableContext";
import { useUpdateCargoContext } from "../UpdateCargo";
import { WHCargoModal } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal";

export const TripTab = ({
  trip,

  columns,
  onCargosUpdate,
}: {
  trip: TripType;
  columns: UseTableColumnsSchema<CargoType>[];
  onCargosUpdate: (cities: string[], cargos: CargoType[]) => void;
}) => {
  const { isOnlyMyCargos } = useCargosVisibility();

  const { data, isFetched, isLoading, isSuccess } = useQuery({
    queryKey: [`cargo-${trip.id}`],
    queryFn: async () => await getCargos(trip.id.toString()),
    enabled: !!trip.id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    // const { mutate, isPending } = useMutation({
    //   mutationKey: [`cargo-${trip.id}`],
    //   mutationFn: getCargos,
    //   onSuccess: (data) => {
    //     setCargos(data);
    //   },
  });

  const [cargos, setCargos] = useState<CargoType[]>(data || []);

  const getSortedCargos = useCallback(
    (cargos: CargoType[]) => {
      const priorityCities = ["Астана", "Алмата", "Караганда"];
      const crgs = isOnlyMyCargos
        ? cargos?.filter((e) => e.user_id == user.id.toString())
        : cargos;

      return crgs?.sort((a, b) => {
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
    },
    [cargos, isOnlyMyCargos, data]
  );

  const [citiesData, setCitiesData] = useState(null);
  const [rowSelected, setRowSelected] = useSelectionContext();

  const { setRow, disclosure } = useUpdateCargoContext();

  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {
        const { original } = info;
        setRow(original);
        disclosure.onOpenChange();
      },
      className: "cursor-pointer",
    },
  };

  const { user } = useUser();

  useEffect(() => {
    if (data) {
      setRowSelected(
        data?.map((e) => ({
          number: e.id,
          isSelected: false,
        }))
      );
      setCitiesData(groupCargosByCity(getSortedCargos(data)));
    }
  }, [data, isOnlyMyCargos]);

  useEffect(() => {
    if (data) {
      onCargosUpdate(
        data?.map((cargo) => cargo.unloading_point.city),
        data
      );
      setCargos(data);
    }
  }, [data]);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-trip${trip.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: getSchema(),
          table: "cargos",
          filter: `trip_id=eq.${trip.id}`,
        },
        (payload) => {
          const newCargo = payload.new as CargoType;

          if (payload.eventType !== "UPDATE") {
            setCargos((prev) => {
              setCitiesData(
                groupCargosByCity(getSortedCargos([...prev, newCargo]))
              );
              return [...prev, newCargo];
            });
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

              setCitiesData(groupCargosByCity(getSortedCargos(res)));

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
  const [_, copy] = useCopyToClipboard();

  if (isLoading || !citiesData)
    return (
      <div className="flex justify-center items-center">
        <SgmSpinner />
      </div>
    );

  return (
    <>
      {cargos?.length > 0 && (
        <div className="flex justify-between">
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
          <AllManagerButtons cargos={cargos} trip={trip} />
        </div>
      )}
      <div className="my-8">
        <WHCargoTable trip={trip} />
      </div>

      <div className="space-y-4">
        {!isLoading &&
          isFetched &&
          isSuccess &&
          citiesData.map((e) => (
            <div key={e.city}>
              <span className="text-2xl font-semibold pl-4">{e.city}</span>
              <Divider />

              <UTable
                tBodyProps={{
                  emptyContent: `Пока что в рейсе №${trip.trip_number} нет грузов`,
                  isLoading: isLoading,
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
          <UpdateTripNumber currentTripNumber={trip.trip_number} />
          <DeleteCargo />
        </div>
      )}
      {/* {cargos?.length > 0 && (
        <div className="flex justify-end">
          <AllManagerButtons cargos={cargos} trip={trip} />
        </div>
      )} */}
      <div className="mb-8"></div>
      <BarGraph cargos={cargos} />
      <div className="mb-8"></div>
    </>
  );
};
