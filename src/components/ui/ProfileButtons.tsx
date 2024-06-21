"use client";

import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const ProfileButtons = () => {
  const router = useRouter();
  const user = useUser();
  const clerk = useClerk();

  return (
    <>
      {user.isSignedIn ? (
        <div className="flex gap-4 items-center">
          <UserButton />
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => {
              clerk.openUserProfile();
            }}
          >
            <span>{user.user.fullName}</span>
            <span className="text-zinc-500">{user.user.username}</span>
          </div>
        </div>
      ) : (
        <Button
          variant="flat"
          onClick={() => {
            router.push("/auth");
          }}
        >
          Log In
        </Button>
      )}
    </>
  );
};
