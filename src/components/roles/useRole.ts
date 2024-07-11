import { useUser } from "@clerk/nextjs";

export function useRole() {
  const { user } = useUser();

  if (!user) return null;

  return user.publicMetadata?.role || "Пользователь";
}
