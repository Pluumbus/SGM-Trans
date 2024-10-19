import { useUser } from "@clerk/nextjs";

export type Role = (typeof roleNamesList)[number] | "Пользователь";

export const useRole = (): Role =>  {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return "Пользователь";
  }

  return (user?.publicMetadata.role as Role) || "Пользователь";
}

export const useCheckRole = (allowedRoles: string[]) => {
  const { user, isLoaded } = useUser();

  if (isLoaded && !user) {
    return false;
  }
  const userRole = user?.publicMetadata.role as string;

  return allowedRoles.includes(userRole);
};

export const roleNamesList = [
  "Админ",
  "Логист",
  "Логист Москва",
  "Логист Дистант",
  "Супер Логист",
  "Зав.Склада",
  "Зав.Склада Москва",
  "Кассир",
  "Менеджер"
] as const;
