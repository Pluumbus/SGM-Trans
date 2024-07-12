"use client";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { WeekCard } from "../_feature/WeekCard";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { slug } = useParams();

  return (
    <div>
      <span className="flex justify-center font-semibold">
        {slug === "kz" ? "Таблица КЗ" : "Таблица МСК"}
        {/* TODO Далее уже корректить какой рендер нужен для мск таблички пока что темплейт */}
      </span>
      <WeekCard />
    </div>
  );
};
export default Page;
