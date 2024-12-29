"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useDisclosure, UseDisclosureProps } from "@nextui-org/react";
import {
  CarDetailsType,
  CarsType,
  SingleDetailType,
} from "@/lib/references/drivers/feature/types";
import {
  ReportStatisticsType,
  ResponseCanData,
  VehicleCan,
  VehicleReportStatisticsType,
} from "../_api/types";

export type DetailNameType =
  | "wheel"
  | "brake_shoe"
  | "detail"
  | "accumulator"
  | "axis"
  | "deleteAxis";

export interface DisclosureContextType extends UseDisclosureProps {
  onOpenChange: () => void;
  data: {
    detail: SingleDetailType;
    car?: CarsType & {
      omnicommData: VehicleCan;
    };

    type: DetailNameType;
  };
  setData: Dispatch<
    SetStateAction<{
      detail: SingleDetailType;
      car?: CarsType & {
        omnicommData: VehicleCan;
      };

      type: DetailNameType;
    }>
  >;
}

const DisclosureContext = createContext<DisclosureContextType | undefined>(
  undefined
);

export const DisclosureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const disclosure = useDisclosure();

  const [data, setData] = useState<any>(null);

  return (
    <DisclosureContext.Provider
      value={{
        ...disclosure,
        data,
        setData,
      }}
    >
      {children}
    </DisclosureContext.Provider>
  );
};

export const useDisclosureContext = (): DisclosureContextType => {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error(
      "useDisclosureContext must be used within a DisclosureProvider"
    );
  }
  return context;
};
