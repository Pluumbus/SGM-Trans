"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import { TrendingUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { getUserById } from "../../../_api";

import { motion } from "framer-motion";
import { CargoType } from "@/app/workflow/_feature/types";
import { COLORS } from "@/lib/colors";

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

  const totalWeight =
    mCargos && mCargos.length > 0
      ? mCargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.weight);
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalVolume =
    mCargos && mCargos.length > 0
      ? mCargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.volume);
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  const totalSumm =
    mCargos && mCargos.length > 0
      ? mCargos.reduce((sum, cargo) => {
          const value = parseFloat(cargo.amount.value);
          return isNaN(value) ? sum : sum + value;
        }, 0)
      : 0;

  return (
    <Card>
      <CardHeader>
        <span>Статистика по Грузам</span>
      </CardHeader>
      <CardBody>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Card className="mb-3">
              <CardBody>
                <div className="flex justify-around">
                  <span>
                    Общий вес:{" "}
                    <b
                      style={{
                        color: `${totalWeight <= 11 ? `${COLORS.green}` : totalWeight <= 19.9 ? `${COLORS.yellow}` : totalWeight <= 22 ? `${COLORS.orange}` : `${COLORS.red}`}`,
                      }}
                    >
                      {totalWeight}/22
                    </b>{" "}
                    тонн
                    <div
                      style={{
                        color: `${COLORS.red}`,
                      }}
                      className="font-bold"
                    >
                      {totalWeight > 22 && "Разгрузите машину"}
                    </div>
                  </span>
                  <span>
                    Общий объем:{" "}
                    <b
                      style={{
                        color: `${totalVolume <= 47 ? `${COLORS.green}` : totalVolume <= 79 ? `${COLORS.yellow}` : totalVolume <= 92 ? `${COLORS.orange}` : `${COLORS.red}`}`,
                      }}
                    >
                      {totalVolume}/92
                    </b>{" "}
                    м.куб.
                    <div
                      style={{
                        color: `${COLORS.red}`,
                      }}
                      className="font-bold"
                    >
                      {totalVolume > 92 && "Разгрузите машину"}
                    </div>
                  </span>
                  <span>
                    Сумма:{" "}
                    <b
                      style={{
                        color: `${totalSumm < 2500000 ? `${COLORS.red}` : `${COLORS.green}`}`,
                      }}
                    >
                      {totalSumm}
                    </b>{" "}
                    тг
                  </span>
                </div>
              </CardBody>
            </Card>

            <CustomBar
              data={chartData}
              cargoCount={cargos.length}
              colors={colors}
            />
          </>
        )}
      </CardBody>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Лидирует
          <span>{leadingManager?.map((e) => <span key={e}>{e}</span>)}</span>
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
}: {
  data: {
    user: string;
    count: number;
    percentageOfAll: number;
    percentage: number;
  }[];
  cargoCount: number;
  colors: any[];
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
        <span>Всего грузов: {cargoCount}</span>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        {state.map((e, i) => (
          <div key={`cargo-statistics-${i}`}>
            <div className="flex justify-between w-full">
              <span className="w-[10%] text-lg font-semibold">{e.user}</span>
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
        ))}
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
