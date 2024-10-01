"use client";
import { useState, useEffect } from "react";

type useLocalStorageProps<T> = {
  initialData: T;
  identifier: string;
};

declare global {
  interface window {
    localStorage: Storage;
  }
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
  const [data, setData] = useState<T>(
    (window.localStorage.getItem(identifier) as T) || initialData
  );

  useEffect(() => {
    const item = window.localStorage.getItem(identifier);
    if (item) {
      setData(JSON.parse(item));
    }
  }, [identifier]);

  useEffect(() => {
    window.localStorage.setItem(
      identifier,
      typeof data != "string" ? JSON.stringify(data) : data
    );
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
