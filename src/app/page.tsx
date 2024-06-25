"use client";

import Navbar from "../components/ui/navbar";
import { useUser } from "@clerk/nextjs";
import Dashboard from "./profile/dashboard";

export default function Home() {
  return (
    <div className=" flex flex-col gap-2">
      {/* <AssignRole />
      <Dashboard /> */}
    </div>
  );
}
