"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

export const ProfileButton = () => {
  const { user } = useUser();
  const balance = (user?.publicMetadata?.balance as string | undefined) ?? "0";
  return (
    <div>
      <Link href="/profile" className="flex gap-4 items-center">
        <Avatar src={user?.imageUrl} />
        <div className="flex flex-col">
          <span className="text-sm">Личный кабинет</span>
          <span className="text-xs text-zinc-400">Баланс: {balance}</span>
        </div>
      </Link>
    </div>
  );
};
