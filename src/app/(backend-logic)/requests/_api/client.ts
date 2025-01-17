"use server";
import bitrix from "@/utils/bitrix/client";

export const getRequestsFromBitrix = async () => {
  const data = await bitrix.leads.list();
  return data;
};
