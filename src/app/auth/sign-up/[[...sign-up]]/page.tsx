"use client";
import { SignUp } from "@clerk/nextjs";
import { NextPage } from "next";
import React from "react";
interface Props {
  params: {};
}
const Page: NextPage<Props> = ({}) => {
  return (
    <div className="flex justify-center py-24">
      <SignUp />
    </div>
  );
};

export default Page;
