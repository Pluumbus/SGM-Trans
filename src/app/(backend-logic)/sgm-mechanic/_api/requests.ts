"use client";

import { fetchFromAPI } from "./api";
import { TrackReport, VehicleObject, VehicleTreeObject } from "./types";

const getVehiclesTree = async (): Promise<VehicleTreeObject> => {
  return await fetchFromAPI("/ls/api/v2/tree/vehicle");
};

const getSingleVehicleInfo = async (id: string): Promise<VehicleObject> => {
  return await fetchFromAPI(`/ls/api/v1/profile/vehicle/${id}`);
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

export const getVihiclesInfo = async () => {
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
