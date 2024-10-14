"use server";

import getClerkClient from "@/utils/clerk/clerk";
import { useUser } from "@clerk/nextjs";

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

export const setUserRole = async ({
  userId,
  publicMetadata: { role },
}: {
  userId: string;
  publicMetadata: {
    role: string;
  };
}) => {
  const { user, isLoaded } = useUser();
  const userData = isLoaded && user;
  const balance = userData.publicMetadata.balance as number;
  const time = userData.publicMetadata.time as number;
  const prevTime = userData.publicMetadata.prevTime as number;
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: { role, balance, time, prevTime },
  });
};

export const setUserBalance = async ({
  userId,
  publicMetadata: { balance },
}: {
  userId: string;
  publicMetadata: {
    balance: number;
  };
}) => {
  const { user, isLoaded } = useUser();
  const userData = isLoaded && user;
  const role = userData.publicMetadata.role as string;
  const time = userData.publicMetadata.time as number;
  const prevTime = userData.publicMetadata.prevTime as number;
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: { role, balance, time, prevTime },
  });
};
