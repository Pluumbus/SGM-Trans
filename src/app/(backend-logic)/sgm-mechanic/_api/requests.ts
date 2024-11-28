"use client";

import { fetchFromAPI } from "./api";
import {
  ReportStatisticsType,
  TrackReport,
  VehicleObject,
  VehicleTreeObject,
} from "./types";

export const getVehiclesTree = async (): Promise<VehicleTreeObject> => {
  return await fetchFromAPI("/ls/api/v2/tree/vehicle");
};

const getSingleVehicleInfo = async (id: string): Promise<VehicleObject> => {
  return await fetchFromAPI(`/ls/api/v1/profile/vehicle/${id}`);
};

const getSingleVehicleFuelLevel = async (
  id: string
): Promise<VehicleObject> => {
  const timeBegin = 1712084400; // UNIX for 2024-01-01 00:00:00
  const timeEnd = 1722625200; // UNIX for 2024-08-02 00:00:00

  return await fetchFromAPI(
    `/ls/api/v1/reports/fuellevel/${id}?timeBegin=${timeBegin}&timeEnd=${timeEnd}`
  );
};

/** @param id - Это либо terminal ID или uuid машины */
export const getVehicleReport = async (
  id?: string | number
): Promise<TrackReport> => {
  const timeBegin = 1712084400; // UNIX for 2024-01-01 00:00:00
  const timeEnd = 1722625200; // UNIX for 2024-08-02 00:00:00

  const tempID = id || 202010968; // Terminal ID - этот я для теста взял первый из списка который мне отдал getVihiclesInfo
  // для теста оставил tempID

  return await fetchFromAPI(
    `/ls/api/v1/reports/track/${tempID}?timeBegin=${timeBegin}&timeEnd=${timeEnd}`
  );
};

/** @param id - Это либо terminal ID или uuid машины @returns current state of the vehicle */
export const getVehicleCurrentState = async (
  id?: string | number
): Promise<TrackReport> => {
  const tempID = id || 202010968;

  return await fetchFromAPI(`/ls/api/v1/vehicles/${tempID}/state`);
};

export const getVehiclesFuelLevel = async () => {
  const vehiclesTree = await getVehiclesTree();

  const allVehiclesData = await Promise.all(
    vehiclesTree.objects.map(async (vehicle) => {
      const singleVehicleInfo = await getSingleVehicleFuelLevel(vehicle.uuid);
      return {
        ...vehicle,
        details: singleVehicleInfo,
      };
    })
  );

  return allVehiclesData;
};

export const getVehiclesInfo = async () => {
  const vehiclesTree = await getVehiclesTree();

  const allVehiclesData = await Promise.all(
    vehiclesTree.objects.map(async (vehicle) => {
      const singleVehicleInfo = await getSingleVehicleInfo(vehicle.uuid);
      return {
        ...vehicle,
        details: singleVehicleInfo,
      };
    })
  );

  return allVehiclesData;
};

export const getAllVehiclesStates = async () => {
  const vehiclesTree = await getVehiclesTree();

  const allVehiclesData = await Promise.all(
    vehiclesTree.objects.map(async (vehicle) => {
      const singleVehicleInfo = await getVehicleCurrentState(vehicle.uuid);
      return {
        ...vehicle,
        details: singleVehicleInfo,
      };
    })
  );

  return allVehiclesData;
};
export const getAllVehiclesStatistics =
  async (): Promise<ReportStatisticsType> => {
    const vehiclesTree = await getVehiclesTree();
    const allVehiclesUuid = vehiclesTree.objects.map(
      (vehicle) => vehicle.terminal_id
    );

    return await getSingleVehicleStatistics(allVehiclesUuid);
  };

export const getSingleVehicleStatistics = async (vUuid: number[]) => {
  const timeBegin = 1732771200; // (2024-09-01 00:00:00 UTC).
  const timeEnd = 1735689599; //  (2024-12-31 23:59:59 UTC).
  const encodedVUuid = encodeURIComponent(`[${vUuid.join(",")}]`);

  return await fetchFromAPI(
    `/ls/api/v1/reports/statistics?timeBegin=${timeBegin}&timeEnd=${timeEnd}&dataGroups=[mw,cmw,fuel,can,canmnt,ccan]&vehicles=${encodedVUuid}`
  );
};
