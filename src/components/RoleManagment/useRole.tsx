"use client";

import { useUser } from "@clerk/nextjs";

export type Role = (typeof roleNamesList)[number] | "Пользователь";

export const useRole = (): Role => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return "Пользователь";
  }

  return (user?.publicMetadata.role as Role) || "Пользователь";
};

export const useCheckRole = (allowedRoles: Roles[]) => {
  const { user, isLoaded } = useUser();

  if (isLoaded && !user) {
    return false;
  }
  const userRole = user?.publicMetadata.role as string;

  // @ts-ignore
  return allowedRoles.includes(userRole);
};

type Roles =
  | "Админ"
  | "Логист"
  | "Логист Москва"
  | "Логист Дистант"
  | "Супер Логист"
  | "Зав.Склада"
  | "Зав.Склада Москва"
  | "Кассир"
  | "Менеджер";

export const roleNamesList = [
  "Админ",
  "Логист",
  "Логист Москва",
  "Логист Дистант",
  "Супер Логист",
  "Зав.Склада",
  "Зав.Склада Москва",
  "Кассир",
  "Менеджер",
] as const;
