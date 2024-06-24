"use client";

import { NextPage } from "next";
import { WeekCard } from "./_feature/WeekCard";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <WeekCard />
    </div>
  );
};

export default Page;
