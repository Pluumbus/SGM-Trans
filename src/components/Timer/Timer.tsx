"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { Button, Card, CardBody } from "@nextui-org/react";
import { toast } from "@/components/ui/use-toast";
import { setUserData } from "@/lib/references/clerkUserType/SetUserFuncs";
import { Role, useCheckRole } from "../RoleManagment/useRole";

export const Timer = () => {
  const { user, isLoaded } = useUser();
  // const accessVisibl = useCheckRole(["Логист Дистант"]);
  let oldSec = isLoaded && (user.publicMetadata.time as number);

  const [seconds, setSeconds] = useState(() => {
    if (oldSec % 60 === 0) return Number(localStorage.getItem("seconds"));
    return oldSec;
  });

  const { mutate: setTimeMutation } = useMutation({
    mutationKey: ["SetTimeForUser"],
    mutationFn: async (newSec: number) => {
      await setUserData({
        userId: user.id,
        publicMetadata: {
          role: user.publicMetadata.role as string,
          balance: user.publicMetadata.balance as number,
          time: newSec,
          prevTime: seconds,
        },
      });
    },
  });

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          localStorage.setItem("seconds", newSeconds.toString());
          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    let activityTimeout;

    const handleUserActivity = () => {
      clearTimeout(activityTimeout);

      setIsActive(true);

      activityTimeout = setTimeout(() => {
        setIsActive(false);
        // toast({
        //   title: `Пауза`,
        //   description: `Ваш таймер был остановлен из-за бездействия`,
        // });
      }, 300000);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      clearTimeout(activityTimeout);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);
  useEffect(() => {
    let endJobTimeout;

    if (isActive) {
      endJobTimeout = setTimeout(() => {
        handleRefreshTimer();
      }, 3600000);
    }

    return () => clearTimeout(endJobTimeout);
  }, [isActive]);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const displaySeconds = seconds % 60;

  const getDeclension = (num, singular, few, many) => {
    if (num > 10 && num < 20) return many;
    const lastDigit = num % 10;
    if (lastDigit === 1) return singular;
    if (lastDigit >= 2 && lastDigit <= 4) return few;
    return many;
  };

  const hoursLabel = getDeclension(hours, "час", "часа", "часов");
  const minutesLabel = getDeclension(minutes, "минута", "минуты", "минут");
  const secondsLabel = getDeclension(
    displaySeconds,
    "секунда",
    "секунды",
    "секунд"
  );

  const handleRefreshTimer = () => {
    toast({
      title: `Рабочий день закончен`,
    });
    setIsActive(false);
    setTimeMutation(0);
  };

  return (
    <div>
      {/* <Card className="flex justify-center w-auto bg-gray-200">
        <CardBody>
          <p>
            {hours} {hoursLabel}, {minutes} {minutesLabel}, {displaySeconds}{" "}
            {secondsLabel}
          </p>
        </CardBody>
      </Card> */}
    </div>
  );
};
