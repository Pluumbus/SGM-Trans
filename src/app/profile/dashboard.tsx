"use client";
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  // const rolesList = {
  //   Admin: <div>Ваша роль Админ</div>,
  //   Logist: <div>Ваша роль Логист</div>,
  //   LogisctMSC: <div>Ваша роль Логист Москва</div>,
  //   SuperLogist: <div>Ваша роль Супер Логист</div>,
  //   WarehouseManager: <div>Ваша роль Зав.Склада</div>,
  //   WarehouseManagerMSC: <div>Ваша роль Зав.Склада Москва</div>,
  //   Cashier: <div>Ваша роль Кассир</div>,
  //   Guest: <div>Ваша роль Гость</div>
  // };

  if (role === "Admin") {
    return <div>Admin</div>;
  } else if (role === "user") {
    return <div>User</div>;
  } else {
    return <div>Guest</div>;
  }
}

export default Dashboard;
