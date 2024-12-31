"use client";

import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ReqListContextValue {
  selectedReq: ClientRequestTypeDTO | null;
  setSelectedReq: React.Dispatch<
    React.SetStateAction<ClientRequestTypeDTO | null>
  >;
  disclosure: ReturnType<typeof useDisclosure> | null;
}

const ReqListContext = createContext<ReqListContextValue>({
  selectedReq: null,
  setSelectedReq: () => {},
  disclosure: null,
});

export const ReqListContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedReq, setSelectedReq] = useState(null);
  const disclosure = useDisclosure();

  return (
    <ReqListContext.Provider
      value={{ selectedReq, setSelectedReq, disclosure }}
    >
      {children}
    </ReqListContext.Provider>
  );
};

export const useReqItem = () => useContext(ReqListContext);
