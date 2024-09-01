export type UsersList = {
  id: string;
  email: string;
  userName: string;
  avatar: string;
  role: string;
  balance: number;
  time: number;
  prevTime: number;
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
];
