"use server";

import getClerkClient from "@/utils/clerk/clerk";
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
  const user = await (await getClerkClient()).users.getUser(userId);
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: {
      role,
      balance: user.publicMetadata.balance as number,
      time: user.publicMetadata.time as number,
      prevTime: user.publicMetadata.prevTime as number,
    },
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
  const user = await (await getClerkClient()).users.getUser(userId);
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: {
      role: user.publicMetadata.role as string,
      balance,
      time: user.publicMetadata.time as number,
      prevTime: user.publicMetadata.prevTime as number,
    },
  });
};

export const changeUserBalance = async ({
  userId,
  addBal,
}: {
  userId: string;
  addBal: number;
}) => {
  const user = await (await getClerkClient()).users.getUser(userId);
  const balance = (user.publicMetadata.balance as number) + addBal;
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: {
      role: user.publicMetadata.role as string,
      balance,
      time: user.publicMetadata.time as number,
      prevTime: user.publicMetadata.prevTime as number,
    },
  });
};
