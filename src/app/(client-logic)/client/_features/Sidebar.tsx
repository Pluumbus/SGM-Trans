"use client";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { FaPlus, FaHome, FaUser, FaTruck } from "react-icons/fa";
import logo from "@/app/_imgs/logo.png";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileButton } from "@/components/ui/ProfileButton/profileButton";
import { PATHS } from "@/lib/consts";

import { Button, Card, CardBody, useDisclosure } from "@nextui-org/react";
import { AddRequest } from "./Modals";

export const Sidebar = () => {
  const addRequestDisclosure = useDisclosure();
  return (
    <div className="left-0 top-0 h-screen w-1/6 px-8 py-10 bg-white border-r shadow-lg flex flex-col justify-between">
      <div>
        <Link href={PATHS.client}>
          <Image src={logo} alt="sgm-trans-logo" className="mx-auto mb-8" />
        </Link>

        <div className="mb-6">
          <h2 className="text-center text-gray-400 font-semibold mb-4">МЕНЮ</h2>
          <div className="flex flex-col">
            {items.map((e, i) => (
              <Link key={i} href={e.link} className="pl-2 cursor-pointer">
                <Card isHoverable shadow="none">
                  <CardBody className="flex items-center flex-row gap-3">
                    <span>{e.icon}</span>
                    <span className="font-semibold">{e.title}</span>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center w-full mt-4">
            <Button
              className="flex items-center gap-3 py-2 rounded-[.5rem]"
              variant="ghost"
              // color="success"
              onClick={() => {
                addRequestDisclosure.onOpenChange();
              }}
            >
              <span>
                <FaPlus />
              </span>
              <span className="font-semibold">Создать заявку</span>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-center text-gray-400 font-semibold mb-2">
          АККАУНТ
        </h2>
        <div className="flex justify-start pl-2 mt-4">
          <SignedOut>
            <SignInButton>Войти</SignInButton>
          </SignedOut>
          <SignedIn>
            <ProfileButton />
          </SignedIn>
        </div>
      </div>
      <AddRequest disclosure={addRequestDisclosure} />
    </div>
  );
};

const items: { icon: ReactNode; title: string; link: string }[] = [
  { icon: <FaHome />, title: "Главная", link: PATHS.client },
  { icon: <FaTruck />, title: "Заявки", link: PATHS.requests },
];
