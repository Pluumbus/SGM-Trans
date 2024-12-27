"use client";
import { NextPage } from "next";
import { ReqList } from "./_features/ReqList";
import { ReqListContextProvider } from "./_features/Context";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <ReqListContextProvider>
      <ReqList />
    </ReqListContextProvider>
  );
};

export default Page;
