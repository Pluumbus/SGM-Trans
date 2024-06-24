"use client";

import AssignRole from "@/components/ui/assignRole";
import Dashboard from "@/components/ui/dashboard";
import Navbar from "../components/ui/navbar";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();
  if (isLoaded) console.log(user?.id);
  return (
    <div className=" flex flex-col gap-2">
      <Navbar />
      <AssignRole />
      <Dashboard />
    </div>
  );
}
