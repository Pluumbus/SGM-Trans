import { B24Hook } from "@bitrix24/b24jssdk";

let bitrixClient = null;

const initializeBitrixClient = () => {
  if (bitrixClient) {
    return bitrixClient;
  }
  bitrixClient = new B24Hook({
    b24Url: process.env.NEXT_PUBLIC_BITRIX24_API_URL!,
    secret: process.env.NEXT_PUBLIC_BITRIX24_API_SECRET_KEY!,
    userId: 1,
  });

  return bitrixClient;
};

export default initializeBitrixClient;
