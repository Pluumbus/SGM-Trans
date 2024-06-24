"use client";
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  if (role === "Admin") {
    return <div>Admin</div>;
  } else if (role === "user") {
    return <div>User</div>;
  } else {
    return <div>Guest</div>;
  }
}

export default Dashboard;
