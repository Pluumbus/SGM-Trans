import { GetWeeksTripsCargos } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { Button, Spinner, user } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { useAnimations } from "@/tool-kit/ui/Effects";

import { calculateCurrentPrize } from "./PrizeFormula";
import {
  CurrentWeekIndicator,
  WeekRangesOverlapping,
} from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";

export const ProfilePrize = ({
  isNumberOnly,
  userId,
  dateVal,
}: {
  isNumberOnly: boolean;
  userId?: string;
  dateVal?: { start; end };
}) => {
  const { data: sortedCargosData, isLoading } = useQuery({
    queryKey: ["getCargosForPrize"],
    queryFn: async () => await GetWeeksTripsCargos(),
  });

  const [cargos, setCargos] = useState<{ id: number; amount: number }[]>();
  const [cargosPrize, setCargosPrize] = useState<number>();
  const [prize, setPrize] = useState<number>();

  const { triggerAnimation } = useAnimations();

  useEffect(() => {
    if (sortedCargosData && !cargos) {
      setCargos(getCargosIdAmountFromCurrentWeek(sortedCargosData));
    }
    if (cargos) {
      const userCargos = getCargosIdAmountFromCurrentWeek(
        sortedCargosData,
        userId
      );
      setCargosPrize(
        userCargos.length > 25 ? (userCargos.length - 25) * 1000 : 0
      );

      setPrize(cargos.reduce((acc, cur) => acc + cur.amount, 0));
    }
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

  // calculateCurrentPrize(prize) + cargosPrize >= 0 &&
  //   triggerAnimation("fireworks", {
  //     prize: {
  //       amount: calculateCurrentPrize(prize) + cargosPrize,
  //     },
  //   });

  if (isLoading) return <Spinner />;
  return (
    <div>
      {isNumberOnly ? (
        <span>
          {getSeparatedNumber(calculateCurrentPrize(prize) + cargosPrize, ",")}
        </span>
      ) : (
        <span className="text-xs text-zinc-400">
          Премия:{" "}
          {getSeparatedNumber(calculateCurrentPrize(prize) + cargosPrize, ",")}
        </span>
      )}
    </div>
  );
};

export const getCargosIdAmountFromCurrentWeek = (
  data: any[],
  userId?,
  dateVal?: { start; end }
) => {
  if (userId) {
    return data
      ?.filter((i) =>
        dateVal
          ? WeekRangesOverlapping({
              start_date1: dateVal.start,
              end_date1: dateVal.end,
              start_date2: i.week_dates.start_date,
              end_date2: i.week_date.end_date,
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
  }
  return data
    ?.filter((i) =>
      dateVal
        ? WeekRangesOverlapping({
            start_date1: dateVal.start,
            end_date1: dateVal.end,
            start_date2: i.week_dates.start_date,
            end_date2: i.week_date.end_date,
          })
        : CurrentWeekIndicator(i.week_dates)
    )
    .flatMap((item) =>
      item.trips
        .filter((trip) => trip.cargos.length > 0)
        .flatMap((trip) =>
          trip.cargos.map((cargo) => ({
            id: cargo.id,
            amount: Number(cargo.amount.value),
          }))
        )
    );
};
