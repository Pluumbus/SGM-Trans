import { GetWeeksTripsCargos } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import supabase from "@/utils/supabase/client";
import { Button, Spinner, user } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, SetStateAction } from "react";
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
    cargosCount: number;
  }>();
  const [prize, setPrize] = useState<number>();

  const { triggerAnimation } = useAnimations();
  const handleSetWeekFilter = useCallback(() => {
    const userCargos = getCargosIdAmountFromCurrentWeek(
      sortedCargosData,
      weekNum,
      userId
    );
    const newCargos = getCargosIdAmountFromCurrentWeek(
      sortedCargosData,
      weekNum
    );

    const totalPrize = calculateCurrentPrize(
      newCargos?.reduce((acc, cur) => acc + cur.amount, 0)
    );

    setCargosPrize(calculateCargosForUsers(userCargos, userId));
    setCargos(newCargos);
    setPrize(isKzUser(userId) ? totalPrize : 0);
  }, [sortedCargosData, weekNum, userId]);

  useEffect(() => {
    if (sortedCargosData && isFetched) {
      handleSetWeekFilter();
    }
  }, [sortedCargosData, weekNum, isFetched, handleSetWeekFilter]);

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
            <b>
              {cargosPrize.cargosCount > 25
                ? getSeparatedNumber(
                    Math.round(prize) + cargosPrize?.cargosPrize,
                    ","
                  )
                : 0}
            </b>
          </span>
          <span>
            Грузы: <b>{cargosPrize?.cargosCount}</b>
          </span>
        </div>
      ) : (
        <span className="text-xs text-zinc-400 ">
          Премия:{" "}
          {cargosPrize.cargosCount > 25
            ? getSeparatedNumber(
                Math.round(prize) + cargosPrize?.cargosPrize,
                ","
              )
            : 0}
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
              .filter((crg) => !crg.is_deleted)
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
          trip.cargos
            .filter((crg) => !crg.is_deleted)
            .map((cargo) => ({
              id: cargo.id,
              amount: Number(cargo.amount.value),
            }))
        )
    );
};

const calculateCargosForUsers = (userCargos, userId: string) => {
  if (userId === "user_2q43LAICTieWjrQavnXs5wNbQsc") {
    const cargosPrizeSuperLogist = {
      cargosPrize: userCargos.length * 100,
      cargosCount: userCargos.length,
    };
    return cargosPrizeSuperLogist;
  }
  if (userId === "user_2q4308qq9oDBR0iOG6TGOMhavUx") {
    const cargosPrizeData = {
      cargosPrize:
        (userCargos?.reduce((acc, cur) => acc + cur.amount, 0) * 3) / 100,
      cargosCount: userCargos.length,
    };

    return cargosPrizeData;
  } else {
    const cargosPrizeData = {
      cargosPrize: userCargos.length > 25 ? (userCargos.length - 25) * 1000 : 0,
      cargosCount: userCargos.length,
    };
    return cargosPrizeData;
  }
};

export const isKzUser = (userId: string) => {
  switch (userId) {
    case "user_2q43LAICTieWjrQavnXs5wNbQsc":
      return false;
    case "user_2q4308qq9oDBR0iOG6TGOMhavUx":
      return false;
    case "user_2rNcH8Rzxw4GHw5NvfBqJJdMuyN":
      return false;
    case "user_2rLaX5Fe4Y69PmWBSdvNm9bBxAn":
      return false;
    default:
      return true;
  }
};
