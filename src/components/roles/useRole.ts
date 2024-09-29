import { useUser } from "@clerk/nextjs";

export function useRole() {
  const { user, isLoaded } = useUser();

  if (isLoaded && !user) return "Пользователь";

  return (isLoaded && user.publicMetadata?.role) || "Пользователь";
}

export const checkRole =  (allowedRoles: string[]) => {
  const { user, isLoaded } = useUser();

  if (isLoaded && !user) {
    return false;
  }
  const userRole = user.publicMetadata?.role as string;

  return allowedRoles.includes(userRole);
};
