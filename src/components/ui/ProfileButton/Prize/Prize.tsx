import { GetWeeksTripsCargos } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { Spinner, user } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { calculateCurrentPrize } from "./PrizeFormula";
import { CurrentWeekIndicator } from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import { isWithinInterval } from "date-fns";

export const ProfilePrize = ({
  isNumberOnly,
  userId,
  dateVal,
}: {
  isNumberOnly: boolean;
  userId: string;
  dateVal?: { start; end };
}) => {
  const { data: sortedCargosData, isLoading } = useQuery({
    queryKey: ["getCargosForPrize"],
    queryFn: async () => await GetWeeksTripsCargos(),
  });

  const [cargos, setCargos] = useState<{ id: number; amount: number }[]>();
  const [prize, setPrize] = useState<number>();

  useEffect(() => {
    if (sortedCargosData && !cargos) {
      setCargos(
        getCargosIdAmountFromCurrentWeek(sortedCargosData, userId, dateVal)
      );
    }

    if (cargos) setPrize(cargos?.reduce((acc, cur) => acc + cur.amount, 0));
  }, [sortedCargosData, cargos]);

  useEffect(() => {
    const cn = supabase
      .channel(`profile-prizes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cargos",
        },
        (payload) => {
          const updatedPrize = payload.new as CargoType;

          if (payload.eventType == "INSERT")
            setCargos((prev) => [
              ...prev,
              {
                id: updatedPrize.id,
                amount: Number(updatedPrize.amount.value),
              },
            ]);
          else
            setCargos((prev) => {
              const newPrize = prev.map((item) =>
                item.id === updatedPrize.id
                  ? {
                      id: updatedPrize.id,
                      amount: Number(updatedPrize.amount.value),
                    }
                  : item
              );
              return newPrize;
            });
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  if (isLoading) return <Spinner />;
  return (
    <>
      {isNumberOnly ? (
        <span>{getSeparatedNumber(calculateCurrentPrize(prize), ",")}</span>
      ) : (
        <span className="text-xs text-zinc-400">
          Премия: <b>{getSeparatedNumber(calculateCurrentPrize(prize), ",")}</b>
        </span>
      )}
    </>
  );
};

export const getCargosIdAmountFromCurrentWeek = (
  data: any[],
  userId,
  dateVal?: { start; end }
) => {
  return data
    ?.filter((i) =>
      dateVal
        ? CurrentWeekIndicator({
            start_date: dateVal.start,
            end_date: dateVal.end,
          })
        : CurrentWeekIndicator(i.week_dates)
    )
    ?.filter((item) =>
      item.trips.some((trip) =>
        trip.cargos.some((cargo) => cargo.user_id === userId)
      )
    )
    .flatMap((item) =>
      item.trips
        .filter((trip) => trip.cargos.length > 0)
        .flatMap((trip) =>
          trip.cargos
            .filter((cargo) => cargo.user_id === userId)
            .map((cargo) => ({
              id: cargo.id,
              amount: Number(cargo.amount.value),
            }))
        )
    );
};
