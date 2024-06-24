"use client";
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  // Не надо так делать, лучше делать
  /* 
    const roleContentMap = {
      Admin: <div>Admin</div>,
      user: <div>User</div>,
      Guest: <div>Guest</div>,
    };

    и это если без билдера если с ним потом напишу меня клерк азебал

    return roleContentMap[role] || roleContentMap.Guest;

  */

  if (role === "Admin") {
    return <div>Admin</div>;
  } else if (role === "user") {
    return <div>User</div>;
  } else {
    return <div>Guest</div>;
  }
}

export default Dashboard;
