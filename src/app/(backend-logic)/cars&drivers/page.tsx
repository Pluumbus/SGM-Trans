"use client";
import { NextPage } from "next";
import { DriversList } from "./_feature/TruckList";
import { GazellList } from "./_feature/GazellList";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="flex justify-around">
      <DriversList />
      <GazellList />
    </div>
  );
};

export default Page;
