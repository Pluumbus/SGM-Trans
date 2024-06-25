"use client";
import { SignOutButton } from "@clerk/nextjs";
import Dashboard from "./dashboard";
import { Button } from "@nextui-org/react";
// import { AssignRole } from "./assignRole";

export default function ProfilePage() {
  return (
    <div>
      <Dashboard />
      {/* <AssignRole /> */}
      <Button color="danger">
        <SignOutButton>Выйти</SignOutButton>
      </Button>
    </div>
  );
}
