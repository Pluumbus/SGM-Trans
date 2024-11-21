"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import { TrendingUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { getUserById } from "../../../_api";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { TotalStats } from "./TotalStats";

export function Chart({ cargos }: { cargos: CargoType[] }) {
  const mCargos = useMemo(() => cargos, [cargos.length]);

  const [chartData, setChartData] = useState([]);
  const [leadingManager, setLeadingManager] = useState([]);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["get users"],
    mutationFn: async (user_id: string) => await getUserById(user_id),
    retryDelay: 5000,
  });

  const groupCargosByUser = async (data) => {
    const grouped = {};

    for (const cargo of data) {
      if (!grouped[cargo.user_id]) {
        try {
          const user = await mutateAsync(cargo.user_id);
          const fullName = `${user.firstName} ${user.lastName}`;
          grouped[cargo.user_id] = { fullName, count: 1 };
        } catch (error) {
          throw error;
        }
      } else {
        grouped[cargo.user_id].count += 1;
      }
    }

    return grouped;
  };

  const calculatePercentages = (groupedData) => {
    const users = Object.keys(groupedData);
    const counts = users.map((user) => groupedData[user].count);
    const maxCount = Math.max(...counts);

    return users.map((user) => ({
      user: groupedData[user].fullName,
      count: groupedData[user].count,
      percentageOfAll: Math.round(
        (groupedData[user].count / mCargos.length) * 100
      ),
      maxCount: maxCount,
      percentage: Math.round((groupedData[user].count / maxCount) * 100),
    }));
  };

  const [colors, setColors] = useState(
    getRandomRainbowColors(chartData?.length)
  );

  useEffect(() => {
    const fetch = async () => {
      if (!mCargos || mCargos.length === 0) return;
      const data = await groupCargosByUser(mCargos);
      if (data) {
        const dataToSet = calculatePercentages(data);
        const leadingManagers = dataToSet
          .filter((e) => e.count === e.maxCount)
          .map((e) => e.user);

        setLeadingManager(leadingManagers);
        setChartData(dataToSet);
        setColors(getRandomRainbowColors(dataToSet.length));
      }
    };

    fetch();
  }, [mCargos.length]);

  return (
    <Card>
      <CardHeader>
        <span>Статистика по Грузам</span>
      </CardHeader>
      <CardBody>
        <TotalStats cargos={cargos} />

        <CustomBar
          data={chartData}
          cargoCount={cargos.length}
          colors={colors}
          isPending={isPending}
        />
      </CardBody>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Лидирует
          {isPending ? (
            <Skeleton className="h-[18px] w-[150px]" />
          ) : (
            <span>{leadingManager?.map((e) => <span key={e}>{e}</span>)}</span>
          )}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Показано общее количество грузов, добавленных каждым менеджером.
        </div>
      </CardFooter>
    </Card>
  );
}

const CustomBar = ({
  data,
  cargoCount,
  colors,
  isPending,
}: {
  data: {
    user: string;
    count: number;
    percentageOfAll: number;
    percentage: number;
  }[];
  cargoCount: number;
  colors: any[];
  isPending: boolean;
}) => {
  const [state, setState] = useState(data);
  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [data]);

  return (
    <Card className="flex flex-col gap-2 w-full">
      <CardHeader>
        <div className="flex gap-2 items-end">
          <span>Всего грузов:</span>
          <span>
            {isPending ? (
              <Skeleton className="h-[16px] w-[50px]" />
            ) : (
              cargoCount
            )}
          </span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        {isPending ? (
          <div className="flex gap-2 justify-between">
            <Skeleton className="h-[22px] w-[50px]" />
            <Skeleton className="h-[22px] w-[850px]" />
            <Skeleton className="h-[22px] w-[50px]" />
          </div>
        ) : (
          state
            .sort((a, b) => b.count - a.count)
            .map((e, i) => (
              <div key={`cargo-statistics-${i}`}>
                <div className="flex justify-between w-full">
                  <span className="w-[10%] text-lg font-semibold">
                    {e.user}
                  </span>
                  <div className="w-[80%]">
                    <div
                      style={{
                        width: `${e.percentageOfAll}%`,
                        backgroundColor: colors[i],
                      }}
                      className="min-h-full rounded-[0.25rem]"
                    ></div>
                  </div>
                  <span className="w-[10%] flex justify-center text-lg font-semibold">
                    {e.count}
                  </span>
                </div>
              </div>
            ))
        )}
      </CardBody>
    </Card>
  );
};

// const CustomSingleBar = ({
//   data,
//   cargoCount,
//   colors,
// }: {
//   data: {
//     user: string;
//     count: number;
//     percentageOfAll: number;
//     percentage: number;
//   }[];
//   cargoCount: number;
//   colors: any[];
// }) => {
//   const [state, setState] = useState(data);
//   useEffect(() => {
//     if (data) {
//       setState(data);
//     }
//   }, [data]);

//   return (
//     <Card className="flex flex-col gap-2 w-full">
//       <CardHeader>
//         <span>Всего грузов: {cargoCount}</span>
//       </CardHeader>
//       <CardBody className="flex h-full w-full">
//         <div className="min-h-[3rem] w-full flex gap-1">
//           {state.map((e, i) => (
//             <Tooltip
//               content={
//                 <div>
//                   {e.user}: {e.count} {spellRussianWord(e.count, "груз")}
//                 </div>
//               }
//             >
//               <motion.div
//                 initial={{
//                   width: `${i == 0 ? 0 : state[i - 1].percentageOfAll}%`,
//                   height: "100%",
//                 }}
//                 animate={{ width: `${e.percentageOfAll}%` }}
//                 transition={{
//                   duration: 0.75,
//                   ease: "easeInOut",
//                 }}
//                 style={{
//                   backgroundColor: colors[i],
//                 }}
//                 className="min-h-[3rem] h-full rounded-[0.75rem]"
//               />
//             </Tooltip>
//           ))}
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

export const spellRussianWord = (i, e) => {
  switch (i) {
    case 1:
      return `${e}`;
    case 2:
    case 3:
    case 4:
      return `${e}а`;
    default:
      return `${e}ов`;
  }
};

const getRandomRainbowColors = (count) => {
  const baseColors = [
    { hue: 0, name: "red" },
    { hue: 30, name: "orange" },
    { hue: 60, name: "yellow" },
    { hue: 120, name: "green" },
    { hue: 240, name: "blue" },
    { hue: 275, name: "indigo" },
    { hue: 300, name: "violet" },
  ];

  const randomColorInRange = (hue) => {
    const lightness = Math.floor(Math.random() * 100 + 200);
    return `hsl(${hue}, 100%, ${lightness % 100}%)`;
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  let colors = [];

  for (let i = 0; i < count; i++) {
    const baseColor = baseColors[i % baseColors.length];
    const hslColor = randomColorInRange(baseColor.hue);
    const [h, s, l] = hslColor.match(/\d+/g).map(Number);
    const hexColor = hslToHex(h, s, l);
    colors.push(hexColor);
  }

  return colors;
};
