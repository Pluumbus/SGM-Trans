"use client";
import { PATHS } from "@/lib/consts";
import { useUser } from "@clerk/nextjs";
import { Avatar, Divider } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { ProfilePrize } from "./Prize/Prize";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";

export const ProfileButton = () => {
  const { user } = useUser();
  const balance = (user?.publicMetadata?.balance as string | undefined) ?? "0";

  return (
    <div>
      <Link href={PATHS.profile} className="flex gap-4 items-center">
        <Avatar src={user?.imageUrl} />
        <div className="flex flex-col">
          <span className="text-sm">Личный кабинет</span>
          <span className="text-xs text-zinc-400">Баланс: {balance}</span>
          <RoleBasedWrapper allowedRoles={["Логист", "Админ"]}>
            <Divider />
            <ProfilePrize isNumberOnly={false} userId={user?.id} />
          </RoleBasedWrapper>
        </div>
      </Link>
    </div>
  );
};