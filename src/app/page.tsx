"use client";

import AssignRole from "@/components/ui/assignRole";
import Dashboard from "@/components/ui/dashboard";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/ui/navbar";

export default function Home() {
  return (
    <div className=" flex flex-col gap-2">
      <div>
        <Navbar />
        <AssignRole />
        <Dashboard />
      </div>
    </div>
  );
}
