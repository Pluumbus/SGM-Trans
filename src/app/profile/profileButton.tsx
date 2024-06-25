"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";

export const ProfileButton = () => {
  const { user, isLoaded } = useUser();
  return (
    <>
      <Link href="/profile" className="flex gap-4 items-center">
        <Avatar src={user?.imageUrl} />
        <span className="text-sm">Личный кабинет</span>
      </Link>
    </>
  );
};
