"use client";
import { NextPage } from "next";
import { GazellList } from "./_feature/GazellList";
import { DriversList } from "./_feature/DriversList";
import { CarList } from "./_feature/CarList";
import { TrailersList } from "./_feature/TrailersList";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="flex justify-around">
      <DriversList />
      <CarList />
      <TrailersList />
      <GazellList />
    </div>
  );
};

export default Page;
