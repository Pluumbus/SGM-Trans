"use client";
import { useState, useEffect } from "react";

type useLocalStorageProps<T> = {
  initialData: T;
  identifier: string;
};

declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: (options: { template: string }) => Promise<string>;
      };
    };
  }
}

export function useLocalStorage<T>({
  initialData,
  identifier,
}: useLocalStorageProps<T>) {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    const item = window.localStorage.getItem(identifier);
    if (item) {
      setData(JSON.parse(item));
    }
  }, [identifier]);

  useEffect(() => {
    window.localStorage.setItem(identifier, JSON.stringify(data));
  }, [data, identifier]);

  const setToLocalStorage = (newData: T) => {
    setData(newData);
  };

  const clearLocalStorage = () => {
    window.localStorage.removeItem(identifier);
    setData(initialData);
  };

  return { data, setToLocalStorage, clearLocalStorage };
}
