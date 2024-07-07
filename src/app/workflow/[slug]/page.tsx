"use client";

import { NextPage } from "next";
import { WeekCard } from "../_feature/WeekCard";
import { useParams } from "next/navigation";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { slug } = useParams();

  return (
    <div>
      <span className="flex justify-center font-semibold">
        {slug === "kz" ? "Таблица КЗ" : "Таблица МСК"}
      </span>
      <WeekCard />
    </div>
  );
};
export default Page;
