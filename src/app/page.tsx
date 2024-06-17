"use client";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/react";

export default function Home() {
  const { toast } = useToast();
  return (
    <div className=" flex flex-col gap-2">
      Niger!
      <div>
        <Button
          variant="shadow"
          color="secondary"
          onClick={() => {
            toast({
              title: "Ilya Pedik!",
              description: "Nu prosta gay",
            });
          }}
        >
          Press me!
        </Button>
      </div>
    </div>
  );
}
