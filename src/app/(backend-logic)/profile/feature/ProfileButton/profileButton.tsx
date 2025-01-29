"use client";
import { PATHS } from "@/lib/consts";
import { useUser } from "@clerk/nextjs";
import { Avatar, Divider } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { ProfilePrize } from "./Prize/Prize";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { getSeparatedNumber } from "@/tool-kit/hooks";

export const ProfileButton = () => {
  const { user } = useUser();
  const balance = (user?.publicMetadata?.balance as number) ?? 0;

  return (
    <div>
      <Link href={PATHS.profile} className="flex gap-4 items-center">
        <Avatar src={user?.imageUrl} />
        <div className="flex flex-col ">
          <span className="text-sm">Личный кабинет</span>
          <span className="text-xs text-zinc-400">
            Баланс: {getSeparatedNumber(balance)}
          </span>
          <RoleBasedWrapper
            allowedRoles={[
              "Логист Кз",
              "Супер Логист",
              "Логист Москва",
              // "Админ",
            ]}
          >
            <Divider />
            <ProfilePrize
              isNumberOnly={false}
              userId={user?.id}
              // userId={"user_2rLaX5Fe4Y69PmWBSdvNm9bBxAn"}
            />
          </RoleBasedWrapper>
        </div>
      </Link>
    </div>
  );
};
