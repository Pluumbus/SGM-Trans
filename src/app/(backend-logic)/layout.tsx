import Navbar from "@/components/ui/navbar";
import React from "react";

import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { Timer } from "@/components/Timer/Timer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col h-screen ">
      <div>
        <Navbar />
      </div>
      <main className="w-full pt-16 px-6 flex-grow mb-4">
        <div className="flex justify-end mb-3 w-auto">
          <RoleBasedWrapper allowedRoles={["Админ", "Логист Дистант"]}>
            <Timer />
          </RoleBasedWrapper>
        </div>
        {children}
      </main>
    </div>
  );
}
