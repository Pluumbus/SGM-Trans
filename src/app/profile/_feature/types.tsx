import { ReactElement } from "react";

export type UsersList = {
  id: string;
  email: string;
  userName: string;
  avatar: string;
  role: string;
  balance: string;
};
type Dictionary = {
  [key: string]: ReactElement;
};
export const rolesList: Dictionary = {
  Admin: <span>Админ</span>,
  Logist: <span>Логист</span>,
  LogisctMSC: <span>Логист Москва</span>,
  SuperLogist: <span>Супер Логист</span>,
  WarehouseManager: <span>Зав.Склада</span>,
  WarehouseManagerMSC: <span>Зав.Склада Москва</span>,
  Cashier: <span>Кассир</span>,
  Base: <span>Пользователь</span>,
};
export const roleNamesList = [
  "Админ",
  "Логист",
  "Логист Москва",
  "Супер Логист",
  "Зав.Склада",
  "Зав.Склада Москва",
  "Кассир",
];
