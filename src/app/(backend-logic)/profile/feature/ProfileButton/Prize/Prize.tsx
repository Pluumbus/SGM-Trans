import { GetWeeksTripsCargos } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { Button, Spinner, user } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { getSeparatedNumber } from "@/tool-kit/hooks";
import { useAnimations } from "@/tool-kit/ui/Effects";

import { calculateCurrentPrize } from "./PrizeFormula";
import {
  currentWeekIndicator,
  weekRangesOverlapping,
} from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import { useUser } from "@clerk/nextjs";
import { debounce } from "lodash";

export const ProfilePrize = ({
  isNumberOnly,
  userId,
  weekNum,
  dateVal,
}: {
  isNumberOnly: boolean;
  userId?: string;
  weekNum?: number;
  dateVal?: { start; end };
}) => {
  const {
    data: sortedCargosData,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["getCargosForPrize"],
    queryFn: async () => await GetWeeksTripsCargos(),
  });
  const { user } = useUser();
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const [cargos, setCargos] = useState<{ id: number; amount: number }[]>();
  const [cargosPrize, setCargosPrize] = useState<{
    cargosPrize: number;
    cargosCount;
  }>();
  const [prize, setPrize] = useState<number>();

  const { triggerAnimation } = useAnimations();

  console.log(weekNum);
  const handleSetWeekFilter = () => {
    console.log("TRIGGER CARGOS");
    const userCargos = getCargosIdAmountFromCurrentWeek(
      sortedCargosData,
      weekNum,
      userId
    );

    const cargosPrizeData = {
      cargosPrize: userCargos.length > 25 ? (userCargos.length - 25) * 1000 : 0,
      cargosCount: userCargos.length,
    };
    const totalPrize = calculateCurrentPrize(
      cargos.reduce((acc, cur) => acc + cur.amount, 0)
    );
    setCargosPrize(() => cargosPrizeData);
    setPrize(() => totalPrize);
    console.log(totalPrize);
  };

  const debouncedSetWeekFilter = useCallback(
    debounce(handleSetWeekFilter, 300),
    [handleSetWeekFilter]
  );

  useEffect(() => {
    if (sortedCargosData && isFetched) {
      debouncedSetWeekFilter();
      const newCargos = getCargosIdAmountFromCurrentWeek(
        sortedCargosData,
        weekNum
      );
      console.log(newCargos);
      setCargos(() => newCargos);
    }
    return () => {
      debouncedSetWeekFilter.cancel();
    };
  }, [weekNum, sortedCargosData]);
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

  useEffect(() => {
    if (prize === 50000 && !animationTriggered) {
      triggerAnimation("fireworks", {
        prize: {
          amount: prize + cargosPrize.cargosPrize,
          text: user.firstName + " вы получили",
        },
      });

      setAnimationTriggered(true);
    }
  }, [prize, cargosPrize, animationTriggered]);

  if (isLoading) return <Spinner />;
  return (
    <div>
      {isNumberOnly ? (
        <div className="flex flex-col">
          {" "}
          <span>
            Сумма:{" "}
            <b>{getSeparatedNumber(prize + cargosPrize?.cargosPrize, ",")}</b>
          </span>
          <span>
            Грузы: <b>{cargosPrize?.cargosCount}</b>
          </span>
        </div>
      ) : (
        <span className="text-xs text-zinc-400">
          Премия: {getSeparatedNumber(prize + cargosPrize?.cargosPrize, ",")}
        </span>
      )}
    </div>
  );
};

export const getCargosIdAmountFromCurrentWeek = (
  data: any[],
  weekNum?: number,
  userId?: string,
  dateVal?: { start; end }
) => {
  console.log("weekTest", weekNum);
  if (userId) {
    return data
      ?.filter((i) =>
        weekNum ? i.week_number === weekNum : currentWeekIndicator(i.week_dates)
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
      weekNum ? i.week_number === weekNum : currentWeekIndicator(i.week_dates)
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
