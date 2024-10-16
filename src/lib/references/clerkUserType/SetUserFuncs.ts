"use server";

import getClerkClient from "@/utils/clerk/clerk";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

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
  const user = await clerkClient.users.getUser(userId);
  const balance = user.publicMetadata.balance as number
  const time = user.publicMetadata.time as number
  const prevTime = user.publicMetadata.prevTime as number
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
  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role as string
  const time = user.publicMetadata.time as number
  const prevTime = user.publicMetadata.prevTime as number
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: { role, balance, time, prevTime },
  });
};
