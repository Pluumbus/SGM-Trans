import { NotificationTableType } from "@/lib/types/notification.types";
import { Card, CardBody, CardFooter, ScrollShadow } from "@nextui-org/react";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  notifications: NotificationTableType[];
};

export const NotificationsList = ({ notifications }: Props) => {
  return (
    <ScrollShadow className="h-30 flex flex-col gap-2">
      {notifications?.map((notification) => (
        <Card
          key={notification.id}
          isHoverable
          shadow="none"
          className="border border-gray-100 cursor-pointer"
        >
          <CardBody>
            <div className="grid grid-cols-6 divide-x-1 w-[15rem]">
              <span className="col-span-5">{notification?.message}</span>
              <div className="border-l-1 flex justify-center items-center">
                <NotificationIcon type={notification.type} />
              </div>
            </div>
          </CardBody>

          <div className="flex justify-end w-full px-2">
            <span className="text-[11px]">
              {new Date(notification.created_at).toLocaleString("ru-RU")}
            </span>
          </div>
        </Card>
      ))}
    </ScrollShadow>
  );
};
const NotificationIcon = ({
  type,
}: {
  type: NotificationTableType["type"];
}) => {
  const color = type == "default" ? "warning" : type;
  return (
    <div className="relative w-4 h-4 flex items-center justify-center">
      <motion.div
        className={`w-4 h-4 bg-${color}-300 rounded-full absolute`}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className={`w-2 h-2 bg-${color}-600 rounded-full absolute`}></div>
    </div>
  );
};
