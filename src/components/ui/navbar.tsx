"use client";

import Link from "next/link";
import logo from "../../app/_imgs/logo.png";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileButton } from "@/components/ui/profileButton";
import React from "react";
import RoleBasedRedirect from "../roles/RoleBasedRedirect";
import { useRole } from "../roles/useRole";

const Navbar = () => {
  const userRole = useRole();
  return (
    <header className="text-gray-600 body-font bg-white shadow">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <Link href={"/"}>
          <Image src={logo} alt="" width={156} height={120} />
        </Link>
        {userRole != "Пользователь" && (
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <Link
              href="/workflow/kz"
              className="mr-5 cursor-pointer hover:text-gray-900"
            >
              Таблица Казахстан
            </Link>
            <Link
              href="/workflow/ru"
              className="mr-5 cursor-pointer hover:text-gray-900"
            >
              Таблица Москва
            </Link>
            <RoleBasedRedirect allowedRoles={["Админ"]}>
              <Link
                href="/statistics"
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                Статистика
              </Link>
            </RoleBasedRedirect>
          </nav>
        )}

        <SignedOut>
          <SignInButton>Войти</SignInButton>
        </SignedOut>
        <SignedIn>
          <ProfileButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
