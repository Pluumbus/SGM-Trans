import { PATHS } from "@/lib/consts";
import { Card, CardBody } from "@nextui-org/card";
import { NextPage } from "next";
import Link from "next/link";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="mb-10">
        <span className="text-2xl font-semibold">
          Добро пожаловать на SGM-Trans
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link href={PATHS.client}>
          <Card
            isPressable
            isHoverable
            shadow="none"
            className="rounded-[0.6rem] border"
          >
            <CardBody className="flex justify-center items-center">
              <span>Клиент</span>
            </CardBody>
          </Card>
        </Link>
        <Link href={PATHS.workflow_ru}>
          <Card
            isPressable
            isHoverable
            shadow="none"
            className="rounded-[0.6rem] border"
          >
            <CardBody className="flex justify-center items-center">
              <span>Сотрудник</span>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Page;
