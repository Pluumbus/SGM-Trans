"use client";

import { WeekCard } from "../_feature/WeekCard";
import { useParams } from "next/navigation";

const SlugRender = ({}) => {
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
export default SlugRender;
