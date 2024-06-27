"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";

export const ProfileButton = () => {
  const { user, isLoaded } = useUser();
  const balance = (user?.publicMetadata?.balance as string | undefined) ?? "0";
  return (
    <>
      <Link href="/profile" className="flex gap-4 items-center">
        <Avatar src={user?.imageUrl} />
        <div className="flex flex-col">
          <span className="text-sm">Личный кабинет</span>
          <span className="text-xs text-zinc-400">Баланс: {balance}</span>
        </div>
      </Link>
    </>
  );
};
