/* eslint-disable prettier/prettier */
"use server";
import { createClerkClient } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";

const clerkSecretKey = process.env.CLERK_SECRET_KEY!;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const getClerkClient = async () => {
  return createClerkClient({
    secretKey: clerkSecretKey,
    publishableKey: clerkPublishableKey,
  });
};
export const checkRole = async (userId : string, allowedRoles: string[]): Promise<boolean> => {

  if (!userId) {
    return false;
  }

  const user = await (await getClerkClient()).users.getUser(userId);
  const userRole = user.publicMetadata?.role as string;

  return allowedRoles.includes(userRole);
};
export default getClerkClient;
