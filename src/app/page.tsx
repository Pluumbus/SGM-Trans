"use client";
import { Card, CardBody } from "@nextui-org/react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { push } = useRouter();
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="mb-10">
        <span className="text-2xl font-semibold">
          Добро пожаловать на SGM-Trans
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card
          isPressable
          isHoverable
          shadow="none"
          className="rounded-[0.6rem] border"
          onClick={() => {
            push("/client");
          }}
        >
          <CardBody className="flex justify-center items-center">
            <span>Клиент</span>
          </CardBody>
        </Card>
        <Card
          isPressable
          isHoverable
          shadow="none"
          className="rounded-[0.6rem] border"
          onClick={() => {
            push("/workflow/ru");
          }}
        >
          <CardBody className="flex justify-center items-center">
            <span>Сотрудник</span>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Page;
