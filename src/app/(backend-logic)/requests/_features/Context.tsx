"use client";

import { ClientRequestTypeDTO } from "@/app/(client-logic)/client/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AdjustedRequestDTO } from "../types";

type Requests = AdjustedRequestDTO | ClientRequestTypeDTO;
interface ReqListContextValue {
  selectedReq: Requests | null;
  setSelectedReq: React.Dispatch<React.SetStateAction<Requests | null>>;
  disclosure: ReturnType<typeof useDisclosure> | null;
  tripDisclosure: ReturnType<typeof useDisclosure> | null;
}

const ReqListContext = createContext<ReqListContextValue>({
  selectedReq: null,
  setSelectedReq: () => {},
  disclosure: null,
  tripDisclosure: null,
});

export const ReqListContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedReq, setSelectedReq] = useState(null);
  const disclosure = useDisclosure();
  const tripDisclosure = useDisclosure();

  return (
    <ReqListContext.Provider
      value={{ selectedReq, setSelectedReq, disclosure, tripDisclosure }}
    >
      {children}
    </ReqListContext.Provider>
  );
};

export const useReqItem = () => useContext(ReqListContext);
