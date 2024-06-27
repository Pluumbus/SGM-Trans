"use client";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import AssignRole from "./assignRole";

export default function ProfilePage() {
  return (
    <div>
      <AssignRole />
      <Button color="danger">
        <SignOutButton>Выйти</SignOutButton>
      </Button>
    </div>
  );
}
