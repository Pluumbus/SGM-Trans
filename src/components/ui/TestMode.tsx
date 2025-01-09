"use client";
import { Divider, Switch } from "@nextui-org/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DevToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(searchParams.has("dev"));
  }, [searchParams]);

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (isDev) {
      params.delete("dev");
    } else {
      params.set("dev", "");
    }

    const queryString = params.toString()
      ? `?${params.toString().split("=")[0]}`
      : "";

    router.push(`${pathname}${queryString}`);
  };

  return (
    <div className="flex gap-2">
      <Divider orientation="vertical" className="h-8 w-[1px]" />
      <Switch
        color="secondary"
        size="sm"
        isSelected={isDev}
        onValueChange={(e) => {
          setIsDev(e);
          handleToggle();
        }}
      >
        Тест режим
      </Switch>
    </div>
  );
}
