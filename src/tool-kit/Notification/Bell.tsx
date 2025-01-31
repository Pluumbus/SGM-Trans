"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react";
import { cx } from "class-variance-authority";
import React from "react";
import { FaBell, FaMailchimp } from "react-icons/fa6";
import { NotificationsList } from "./NotificationsList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendNotification } from "./requests";
import { useUser } from "@clerk/nextjs";
import { useNotifications } from "./Context";

export const Bell = () => {
  const { user } = useUser();
  const { isLoading, notifications } = useNotifications();

  const { mutate: send } = useMutation({
    mutationFn: sendNotification,
  });

  return (
    <>
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
            "flex flex-col gap-4 overflow-y-scroll scrollbar-thin",
            "h-60"
          )}
        >
          <DropdownItem key="new" className="cursor-default">
            <span>Новые: </span>
            {isLoading ? (
              <Skeleton className="h-4 w-20 rounded-xl" />
            ) : (
              <NotificationsList notifications={notifications} />
            )}
          </DropdownItem>
          <DropdownItem key="read" className="cursor-default">
            <span>Прочитанные: </span>
            {isLoading ? (
              <Skeleton className="h-4 w-20 rounded-xl" />
            ) : (
              <></>
              // <NotificationsList notifications={notifications} />
            )}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button
        isIconOnly
        variant="light"
        onPress={() => {
          send({
            message: "Test",
            users: [user.id],
          });
        }}
      >
        <FaMailchimp />
      </Button>
    </>
  );
};
