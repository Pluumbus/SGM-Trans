"use client";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div className=" flex flex-col gap-2">
      <span>Домашняя страница</span>
      <span>{process.env.NODE_ENV}</span>
    </div>
  );
};

export default Page;
