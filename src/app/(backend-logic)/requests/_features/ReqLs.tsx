"use client";

import React from "react";
import { ReqListContextProvider } from "./Context";
import { ReqList } from "./ReqList";

export const ReqLs = () => {
  return (
    <ReqListContextProvider>
      <ReqList />
    </ReqListContextProvider>
  );
};
