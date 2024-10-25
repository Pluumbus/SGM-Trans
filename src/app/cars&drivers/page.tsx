"use client";
import { NextPage } from "next";
import { DriversList } from "./_feature/DriversList";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <DriversList />
    </div>
  );
};

export default Page;
