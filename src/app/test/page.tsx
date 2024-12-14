"use client";
import { useAnimations } from "@/tool-kit/ui/Effects";
import { Button } from "@nextui-org/react";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { triggerAnimation } = useAnimations();
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => {
          triggerAnimation("fireworks", {
            premia: {
              amount: 1111000000,
            },
          });
        }}
      >
        Феерверки
      </Button>
    </div>
  );
};

export default Page;
