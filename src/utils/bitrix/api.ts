import initializeBitrixClient from "./client";

export const callBitrixApi = async (method, params = {}) => {
  const bitrixClient = initializeBitrixClient;
  try {
    const response = await bitrixClient.call(method, params);
    return response;
  } catch (error) {
    console.error("Bitrix API Error:", error);
    throw error;
  }
};
