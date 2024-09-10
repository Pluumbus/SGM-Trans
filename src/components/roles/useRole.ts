import { useUser } from "@clerk/nextjs";

export function useRole() {
  const { user, isLoaded } = useUser();

  if (isLoaded && !user) return "Пользователь";

  return (isLoaded && user.publicMetadata?.role) || "Пользователь";
}
