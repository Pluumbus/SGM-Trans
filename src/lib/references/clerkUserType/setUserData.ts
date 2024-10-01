"use server";

import getClerkClient from "@/utils/clerk/clerk";

export const setUserData = async ({
  userId,
  publicMetadata: { role, balance, time, prevTime },
}: {
  userId: string;
  publicMetadata: {
    role: string;
    balance: number;
    time: number;
    prevTime: number;
  };
}) => {
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: { role, balance, time, prevTime },
  });
};