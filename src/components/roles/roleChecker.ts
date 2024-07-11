import getClerkClient from "@/utils/clerk/clerk";

export const checkRole = async (
  userId: string,
  allowedRoles: string[],
): Promise<boolean> => {

    if (!userId) {
      return false;
    }
  
    const user = await (await getClerkClient()).users.getUser(userId);
    const userRole = user.publicMetadata?.role as string;
  
    return allowedRoles.includes(userRole);
  };