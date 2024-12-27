"use client";

import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ReqListContextValue {
  selectedReq: ClientRequestTypeDTO | null;
  setSelectedReq: React.Dispatch<
    React.SetStateAction<ClientRequestTypeDTO | null>
  >;
}

const ReqListContext = createContext<ReqListContextValue>({
  selectedReq: null,
  setSelectedReq: () => {},
});

export const ReqListContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedReq, setSelectedReq] = useState(null);

  return (
    <ReqListContext.Provider value={{ selectedReq, setSelectedReq }}>
      {children}
    </ReqListContext.Provider>
  );
};

export const useReqItem = () => useContext(ReqListContext);
