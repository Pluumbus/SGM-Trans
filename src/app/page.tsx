"use client";

import Navbar from "../components/ui/navbar";
import { useUser } from "@clerk/nextjs";
import AssignRole from "./profile/assignRole";
import Dashboard from "./profile/dashboard";

export default function Home() {
  const { user, isLoaded } = useUser();
  if (isLoaded) console.log(user?.id);
  return (
    <div className=" flex flex-col gap-2">
      {/* <Navbar /> */}
      <AssignRole />
      <Dashboard />
    </div>
  );
}
