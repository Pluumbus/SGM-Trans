"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import coin from "@/app/_imgs/mario-coin.png";
import fireworkRocket from "@/app/_imgs/Firework_Rocket.webp";
import { Counter } from "../ui/Counter";
import { useRef } from "react";
import { FireworkEffectType } from "../EffectsContext";

export const FireworkEffect = ({ prize, coinProps }: FireworkEffectType) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    audioRef.current = new Audio("/sounds/super-mario-coin-sound.mp3");
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none bg-black bg-opacity-40">
          <div className="relative w-full h-full">
            <div className="absolute top-[25%] left-[25%] z-10 flex flex-col gap-4">
              <div className="flex gap-2 justify-center">
                <motion.div
                  initial={{ scale: 0.1, opacity: 0, y: -400, rotateX: 90 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [2600, 0],
                    rotateX: 360,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "backOut",
                  }}
                  onAnimationStart={() => {
                    playSound();
                  }}
                >
                  <Image alt="mario-coin" src={coin} width={300} height={300} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.1, opacity: 0, y: -400, rotateX: 90 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [2000, 0],
                    rotateX: 360,
                  }}
                  transition={{
                    duration: 1,
                    ease: "backOut",
                  }}
                >
                  <Image
                    alt="mario-coin"
                    src={coin}
                    width={300}
                    height={300}
                    className={
                      !(coinProps?.quantity == 2 || coinProps?.quantity == 3) &&
                      "opacity-40"
                    }
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.1, opacity: 0, y: -400, rotateX: 90 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [2000, 0],
                    rotateX: 360,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "backOut",
                  }}
                >
                  <Image
                    alt="mario-coin"
                    src={coin}
                    width={300}
                    height={300}
                    className={!(coinProps?.quantity == 3) && "opacity-40"}
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ scale: 0.1, y: -300, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="text-4xl md:text-6xl font-bold text-center "
              >
                <Card className="bg-black bg-opacity-20">
                  <CardBody className="flex justify-center items-center w-full">
                    <div className="flex flex-col gap-2 items-center">
                      <span>{prize?.text || "Премия: "}</span>
                      <Counter from={0} to={prize?.amount} />
                    </div>
                  </CardBody>
                  <CardFooter>
                    <span className="font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-300 font-cinzel">
                      Поздравляем Вас с премией!
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
            <Fireworks />
            <div className="pyro">
              <motion.div
                animate={{ scale: 2 }}
                className="before absolute w-1 h-1 rounded-full animate-[bang_1s_ease-out_infinite_backwards,gravity_1s_ease-in_infinite_backwards,position_5s_linear_infinite_backwards] shadow-[0_0_white]"
              />
              <motion.div
                animate={{ scale: 2 }}
                className="before absolute w-1 h-1 rounded-full animate-[bang_1s_ease-out_infinite_backwards,gravity_1s_ease-in_infinite_backwards,position_5s_linear_infinite_backwards] shadow-[0_0_white]"
              />

              <motion.div
                animate={{ scale: 2 }}
                className="after absolute w-1 h-1 rounded-full animate-[bang_1.25s_ease-out_infinite_backwards,gravity_1.25s_ease-in_infinite_backwards,position_6.25s_linear_infinite_backwards] shadow-[0_0_white]"
              />
              <motion.div
                animate={{ scale: 2 }}
                className="after absolute w-1 h-1 rounded-full animate-[bang_1.25s_ease-out_infinite_backwards,gravity_1.25s_ease-in_infinite_backwards,position_6.25s_linear_infinite_backwards] shadow-[0_0_white]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const Fireworks = () => {
  const groupCount = 4;
  const itemsPerGroup = 6;
  const delayBetweenGroups = 0.3;

  const rockets = Array.from(
    { length: groupCount * itemsPerGroup },
    (_, i) => ({
      id: i,
      group: Math.floor(i / itemsPerGroup),
    })
  );

  return (
    <div className="fixed inset-0 flex justify-center items-end overflow-hidden pointer-events-none">
      {rockets.map((rocket) => {
        const curveDirection = Math.random() > 0.5 ? 1 : -1;
        const curveDegree = 30 + Math.random() * 60;
        const curveX =
          curveDirection * Math.tan((curveDegree * Math.PI) / 180) * 600;

        return (
          <div key={rocket.id} className="absolute bottom-0">
            <motion.div
              initial={{ x: 0, y: 500, opacity: 0, scale: 0.5 }}
              animate={{
                x: curveX,
                y: -600,
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: rocket.group * delayBetweenGroups + Math.random() * 0.3,
                ease: "easeOut",
              }}
              style={{
                left: `${30 + Math.random() * 40}%`,
              }}
            >
              <Image
                src={fireworkRocket}
                alt="Firework Rocket"
                width={60}
                height={100}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
