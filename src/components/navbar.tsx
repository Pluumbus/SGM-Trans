"use client";

import Link from "next/link";
import logo from "../app/_imgs/logo.png";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileButton } from "@/components/profileButton";
import React from "react";

const Navbar = () => {
  return (
    <header className="text-gray-600 body-font bg-white shadow">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <div className="">
          <Link href={"/"}>
            <Image src={logo} alt="" width={156} height={120} />
          </Link>
        </div>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/workflow/kz">
            <div className="mr-5 cursor-pointer hover:text-gray-900">
              Таблица КЗ
            </div>
          </Link>
          <Link href="/workflow/ru">
            <div className="mr-5 cursor-pointer hover:text-gray-900">
              Таблица МСК
            </div>
          </Link>
          {/* <Link href="/">
            <div className="mr-5 cursor-pointer hover:text-gray-900">
              Статистика
            </div>
          </Link> */}
        </nav>
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
