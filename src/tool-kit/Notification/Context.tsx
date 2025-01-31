"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { getNotifications } from "./requests.server";
import {
  NotificationTableType,
  NotificationDTOType,
} from "@/lib/types/notification.types";
import supabase from "@/utils/supabase/client";
import { getSchema } from "@/utils/supabase/getSchema";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

const NOTIFICATION_API = "/api/notifications";

type NotificationContextProviderProps = {
  children: React.ReactNode;
};

type NotificationContextType = {
  notifications: NotificationTableType[];
  isLoading: boolean;
  notificationMutation: ReturnType<typeof useMutation>;
};

export const NotificationContext = createContext({} as NotificationContextType);

export const NotificationContextProvider = ({
  children,
}: NotificationContextProviderProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationTableType[]>(
    []
  );

  const { data, isLoading } = useQuery({
    queryKey: ["GetNotifications"],
    queryFn: getNotifications,
  });

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);

  useEffect(() => {
    if (!user) return;

    const cn = supabase
      .channel(`notifications-view`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: getSchema(),
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as NotificationTableType;

          if (newNotification.users.includes(user.id)) {
            setNotifications((prev) => [...prev, newNotification]);
            toast({ title: newNotification.message });
          }
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, [user]);

  const sendNotification = async ({
    data,
    delayMs,
    repeatMs,
  }: {
    data: NotificationDTOType;
    delayMs?: number;
    repeatMs?: number;
  }) => {
    try {
      const response = await fetch(NOTIFICATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          delay: delayMs || 0,
          repeat: repeatMs || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to send notification");

      console.log(
        "Notification job added:",
        data,
        "Delay:",
        delayMs,
        "Repeat every:",
        repeatMs
      );
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const notificationMutation = useMutation({
    mutationFn: sendNotification,
  });

  return (
    <NotificationContext.Provider
      value={{ notifications, isLoading, notificationMutation }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationContextProvider"
    );
  }
  return context;
};
