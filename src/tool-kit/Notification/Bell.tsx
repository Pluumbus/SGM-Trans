"use client";
import { NotificationTableType } from "@/lib/types/notification.types";
import {
  Alert,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
} from "@nextui-org/react";
import { cx } from "class-variance-authority";
import React from "react";
import { FaBell, FaBellSlash } from "react-icons/fa6";

export const Bell = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <FaBell />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="light"
        hideSelectedIcon
        shouldFocusWrap={false}
        aria-label="notification-list"
        className={cx(
          "flex flex-col gap-4 overflow-y-scroll scrollbar-hide "
          // "h-60 "
        )}
      >
        <DropdownItem key="new" className="cursor-default">
          <span>На данный момент, у вас нет уведомлений</span>
          {/* <span>Новые: </span>
          <ScrollShadow className="h-30 flex flex-col gap-2">
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
          </ScrollShadow> */}
        </DropdownItem>
        {/* <DropdownItem key="read" className="cursor-default">
          <span>Прочитанные: </span>
          <ScrollShadow className="h-30 flex flex-col gap-2">
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
          </ScrollShadow>
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};

const NotificationCard = ({
  notification,
}: {
  notification?: NotificationTableType;
}) => {
  return (
    <Card
      isHoverable
      shadow="none"
      className="border border-gray-100 cursor-pointer"
    >
      <div className="grid grid-cols-3 divide-x-1">
        <Alert>
          <span>{notification?.message}</span>
        </Alert>
      </div>
    </Card>
  );
};
