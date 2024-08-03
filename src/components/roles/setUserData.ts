"use server";

import getClerkClient from "@/utils/clerk/clerk";

export const setUserData = async ({
  userId,
  publicMetadata: { role, balance },
}: {
  userId: string;
  publicMetadata: {
    role: string;
    balance: string;
  };
}) => {
  await (
    await getClerkClient()
  ).users.updateUser(userId, {
    publicMetadata: { role, balance },
  });
};
