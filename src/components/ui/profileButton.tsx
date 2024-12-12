"use client";

import {
  getAllCargos,
  GetWeeksTripsCargos,
} from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { CurrentWeekIndicator } from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import { PATHS } from "@/lib/consts";
import { getSeparatedNumber } from "@/tool-kit/hooks/useNumberState/useNumberState";
import supabase from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Avatar, Divider, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const ProfileButton = () => {
  const { user } = useUser();

  const { data: sortedCargosData, isLoading } = useQuery({
    queryKey: ["getCargosForPrize"],
    queryFn: async () => await GetWeeksTripsCargos(),
  });

  const balance = (user?.publicMetadata?.balance as string | undefined) ?? "0";
  const [cargos, setCargos] = useState<{ id: number; amount: number }[]>();
  const [prize, setPrize] = useState<number>();

  useEffect(() => {
    if (sortedCargosData && !cargos) {
      setCargos(getCargosIdAmountFromCurrentWeek(sortedCargosData, user?.id));
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

  console.log(cargos);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <Link href={PATHS.profile} className="flex gap-4 items-center">
        <Avatar src={user?.imageUrl} />
        <div className="flex flex-col">
          <span className="text-sm">Личный кабинет</span>
          <span className="text-xs text-zinc-400">Баланс: {balance}</span>
          <Divider />
          <span className="text-xs text-zinc-400">
            Премия:{" "}
            <b>{getSeparatedNumber(calculateCurrentPrize(prize), ",")}</b>
          </span>
        </div>
      </Link>
    </div>
  );
};

export const calculateCurrentPrize = (summ: number) => {
  const basePrize = 50000;
  const calcPrize = (perc) => basePrize + ((basePrize * perc) / 100) * 2;
  switch (true) {
    case summ >= 15500000 && summ < 16000000:
      return basePrize;
    case summ >= 16000000 && summ < 20000000:
      return calcPrize(3.23);
    case summ >= 20000000 && summ < 25000000:
      return calcPrize(29.03);
    case summ >= 25000000 && summ < 30000000:
      return calcPrize(61.29);
    case summ >= 30000000 && summ < 40000000:
      return calcPrize(93.55);
    case summ >= 40000000:
      return calcPrize(158.06);
    default:
      return 0;
  }
};

export const getCargosIdAmountFromCurrentWeek = (data: any[], userId) => {
  return data
    ?.filter((i) => CurrentWeekIndicator(i.week_dates))
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
