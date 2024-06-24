"use client";
import Link from "next/link";
import logo from "../../app/imgs/logo.png";

import { ProfileButtons } from "../../app/profile/ProfileButtons";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="text-gray-600 body-font bg-white shadow">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <div className="">
          <Image src={logo} alt="" width={156} height={120} />
        </div>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/">
            <div className="mr-5 cursor-pointer hover:text-gray-900">
              Таблицы
            </div>
          </Link>
          <Link href="/">
            <div className="mr-5 cursor-pointer hover:text-gray-900">
              Статистика
            </div>
          </Link>
          <Link href="/">
            <div className="mr-5 cursor-pointer hover:text-gray-900">
              Что то
            </div>
          </Link>
        </nav>
        <ProfileButtons />
      </div>
    </header>
  );
};

export default Navbar;
