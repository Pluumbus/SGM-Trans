"use client";

import { Card, CardBody } from "@nextui-org/card";
import { useRouter } from "next/navigation";

export const InteractiveCard = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  const router = useRouter();
  return (
    <Card
      isPressable
      isHoverable
      shadow="none"
      className="rounded-[0.6rem] border"
      onClick={() => router.push(href)}
    >
      <CardBody className="flex justify-center items-center">
        <span>{label}</span>
      </CardBody>
    </Card>
  );
};
