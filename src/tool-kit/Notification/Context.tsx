"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { getNotifications } from "./requests.server";
import { NotificationTableType } from "@/lib/types/notification.types";
import supabase from "@/utils/supabase/client";
import { getSchema } from "@/utils/supabase/getSchema";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";

type NotificationContextProviderProps = {
  children: React.ReactNode;
};

type NotificationContextType = {
  notifications: NotificationTableType[];
  isLoading: boolean;
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
  const showNotification = () => {};

  const { data, isLoading } = useQuery({
    queryKey: ["GetNotifications"],
    queryFn: getNotifications,
  });
  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);
  useEffect(() => {
    const cn = supabase
      .channel(`notifications-view`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: getSchema(),
          table: "notifications",
          // filter: `users=contains.${user.id}`,
        },
        (payload) => {
          const newNotficcation = payload.new as NotificationTableType;

          setNotifications((prev) => [...prev, newNotficcation]);
          toast({
            title: newNotficcation.message,
          });
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within an NotificationContext"
    );
  }

  return context;
};
