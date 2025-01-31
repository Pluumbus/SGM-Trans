"use client";

import Link from "next/link";
import logo from "../../app/_imgs/logo.png";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileButton } from "@/app/(backend-logic)/profile/feature/ProfileButton/profileButton";
import React from "react";
import { useRole } from "../RoleManagment/useRole";
import RoleBasedWrapper from "../RoleManagment/RoleBasedWrapper";
import { BiSolidCarMechanic } from "react-icons/bi";
import { PATHS } from "@/lib/consts";
import DevToggle from "./TestMode";
import { Bell } from "@/tool-kit/Notification";

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
            <RoleBasedWrapper allowedRoles={["Админ", "Супер Логист"]}>
              <Link
                href={PATHS.workflow_sl}
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                Супер Логист
              </Link>
            </RoleBasedWrapper>

            <Link
              href={PATHS.cars_drivers}
              className="mr-5 cursor-pointer hover:text-gray-900"
            >
              Машины
            </Link>
            <RoleBasedWrapper allowedRoles={["Кассир", "Админ"]}>
              <Link
                href={PATHS.statistics}
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                Статистика
              </Link>
            </RoleBasedWrapper>

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
            </RoleBasedWrapper>
            <RoleBasedWrapper
              allowedRoles={[
                "Админ",
                "Логист Кз",
                "Логист Москва",
                "Супер Логист",
              ]}
            >
              <Link
                href={PATHS.requestsForLogist}
                className="mr-5 cursor-pointer hover:text-gray-900"
              >
                Заявки от клиентов
              </Link>
            </RoleBasedWrapper>
            {/* <DevToggle /> */}
          </nav>
          /* <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Таблицы</NavigationMenuTrigger>
              <NavigationMenuContent className="z-50 relative">
                <ul className="grid gap-3 p-4  lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a href={PATHS.workflow_ru}>
                        <Button className="mb-2 mt-4 " variant="light">
                          Таблица
                        </Button>
                      </a>
                    </NavigationMenuLink>
                    <Divider />
                  </li>
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a href={PATHS.workflow_kz}>
                        <Button className="mb-2 mt-4 " variant="light">
                          Обратки
                        </Button>
                      </a>
                    </NavigationMenuLink>
                    <Divider />
                  </li>
                  <RoleBasedWrapper allowedRoles={["Админ", "Кассир"]}>
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a href={PATHS.cashbox}>
                          <Button className="mb-2 mt-4 " variant="light">
                            Касса
                          </Button>
                        </a>
                      </NavigationMenuLink>
                      <Divider />
                    </li>
                  </RoleBasedWrapper>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <RoleBasedWrapper allowedRoles={["Админ"]}>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Панель управления</NavigationMenuTrigger>
                <NavigationMenuContent className="z-50">
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[320px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a href={PATHS.sgm_mechanic}>
                          <Button className="mb-2 mt-4 " variant="light">
                            SGM-Механик
                          </Button>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a href={PATHS.statistics}>
                          <Button className="mb-2 mt-4 " variant="light">
                            Статистика
                          </Button>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </RoleBasedWrapper>
            <NavigationMenuItem>
              <Link href={PATHS.cars_drivers} passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Машины
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */
        )}
        <div className="flex gap-4 items-center">
          <Bell />
          <SignedOut>
            <SignInButton>Войти</SignInButton>
          </SignedOut>
          <SignedIn>
            <ProfileButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
