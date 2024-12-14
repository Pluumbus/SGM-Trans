"use client";

import Link from "next/link";
import logo from "../../app/_imgs/logo.png";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileButton } from "@/components/ui/ProfileButton/profileButton";
import React from "react";
import { useRole } from "../RoleManagment/useRole";
import RoleBasedWrapper from "../RoleManagment/RoleBasedWrapper";
import { BiSolidCarMechanic } from "react-icons/bi";
import { Timer } from "../Timer/Timer";
import { PATHS } from "@/lib/consts";

// Изменить ссылки в линках. Сделать их все постоянными и изменяемыми только в одном месте
const Navbar = () => {
  const userRole = useRole();
  return (
    <header className="text-gray-600 body-font bg-white shadow">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <Link href={PATHS.home}>
          <Image src={logo} alt="" width={156} height={120} />
        </Link>
        {userRole != "Пользователь" && (
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <Link
              href={PATHS.workflow_ru}
              className="mr-5 cursor-pointer hover:text-gray-900"
            >
              Таблица
            </Link>

            <Link
              href={PATHS.workflow_kz}
              className="mr-5 cursor-pointer hover:text-gray-900"
            >
              Обратки
            </Link>

            <RoleBasedWrapper allowedRoles={["Админ", "Кассир"]}>
              <Link
                href={PATHS.cashbox}
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                Касса
              </Link>
            </RoleBasedWrapper>

            <Link
              href={PATHS.cars_drivers}
              className="mr-5 cursor-pointer hover:text-gray-900"
            >
              Машины
            </Link>
            <RoleBasedWrapper allowedRoles={["Админ"]}>
              <Link
                href={PATHS.sgm_mechanic}
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                <span className="flex gap-1 items-center">
                  SGM Механик
                  <BiSolidCarMechanic size={20} />
                </span>
              </Link>

              <Link
                href={PATHS.statistics}
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                Статистика
              </Link>
            </RoleBasedWrapper>
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
