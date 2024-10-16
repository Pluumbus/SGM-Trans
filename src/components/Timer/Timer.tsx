"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { setUserData } from "../../lib/references/clerkUserType/SetUserFuncs.ts";
import { useUser } from "@clerk/nextjs";
import { Button, Card, CardBody } from "@nextui-org/react";
import { toast } from "../ui/use-toast";

export const Timer = ({}) => {
  const { user, isLoaded } = useUser();

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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    localStorage.setItem("seconds", seconds.toString());
    if (seconds > 0 && seconds % 60 === 0) {
      setTimeMutation(seconds);
    }
  }, [seconds]);

  useEffect(() => {
    let activityTimeout;

    const handleUserActivity = () => {
      if (isActive) {
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(() => {
          setIsPaused(true);
          setIsActive(false);
          toast({
            title: `Пауза`,
            description: `Ваш таймер был остановлен из-за бездействия`,
          });
        }, 300000);
      }
    };
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      clearTimeout(activityTimeout);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

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
      <Card className="flex justify-center w-64 bg-gray-200">
        <CardBody>
          <p>
            {hours} {hoursLabel}, {minutes} {minutesLabel}, {displaySeconds}{" "}
            {secondsLabel}
          </p>
          {isPaused && (
            <Button
              color="success"
              onClick={() => {
                setIsActive((prev) => !prev);
                setIsPaused(false);
              }}
            >
              Запустить
            </Button>
          )}
          {isActive && (
            <Button
              color="danger"
              className="mt-2"
              onClick={handleRefreshTimer}
            >
              Закончить работу
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
