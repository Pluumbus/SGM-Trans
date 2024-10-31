"use client";
import { NextPage } from "next";
import { DriversList } from "./_feature/TruckList";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <DriversList />
    </div>
  );
};

export default Page;
