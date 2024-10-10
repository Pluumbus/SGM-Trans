"use client";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { WeekCard } from "../_feature/WeekCard";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { slug } = useParams();

  return (
    <div>
      {slug === "kz" ? (
        <div>
          <div className="flex w-full justify-center">
            <span className="text-lg font-semibold">Обратка</span>
          </div>
          <WeekCard />
        </div>
      ) : (
        <div>
          <div className="flex w-full justify-center">
            <span className="text-lg font-semibold">Таблица</span>
          </div>
          <WeekCard />
        </div>
      )}
    </div>
  );
};
export default Page;
