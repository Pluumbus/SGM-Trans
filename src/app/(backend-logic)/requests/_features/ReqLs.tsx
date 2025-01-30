"use client";

import React from "react";
import { ReqListContextProvider } from "./Context";
import { ReqList } from "./ReqList";
import { LeadListContextProvider } from "./BitrixContext";

export const ReqLs = () => {
  return (
    <LeadListContextProvider>
      <ReqList />
    </LeadListContextProvider>
  );
};
