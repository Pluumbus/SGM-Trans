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
  Admin: <div>Админ</div>,
  Logist: <div>Логист</div>,
  LogisctMSC: <div>Логист Москва</div>,
  SuperLogist: <div>Супер Логист</div>,
  WarehouseManager: <div>Зав.Склада</div>,
  WarehouseManagerMSC: <div>Зав.Склада Москва</div>,
  Cashier: <div>Кассир</div>,
  Base: <div>Пользователь</div>,
};
