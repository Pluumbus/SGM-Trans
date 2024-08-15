"use server";
import { UsersList } from "@/components/roles/types";
import { User } from "@clerk/nextjs/server";
import getClerkClient from "@/utils/clerk/clerk";

export const getUserList = async () => {
  const users = await (await getClerkClient()).users.getUserList();
  const userList = users.data.map((user: User) => ({
    id: user.id,
    userName: user.fullName || "Имя отсутствует",
    email: user.emailAddresses[0]?.emailAddress,
    avatar: user.imageUrl,
    role: user.publicMetadata?.role as string | undefined,
    balance: user.publicMetadata?.balance as number | undefined,
  })) satisfies UsersList[];

  return userList;
};
