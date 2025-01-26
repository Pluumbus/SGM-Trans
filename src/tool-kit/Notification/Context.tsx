import { createContext } from "react";

type NotificationContextProviderProps = {
  children: React.ReactNode;
};

type NotificationContextType = {};

export const NotificationContext = createContext({} as NotificationContextType);

export const NotificationContextProvider = ({
  children,
}: NotificationContextProviderProps) => {
  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};
