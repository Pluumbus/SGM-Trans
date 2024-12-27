// "use client";
// import { useState, useEffect } from "react";

// type useLocalStorageProps<T> = {
//   initialData: T;
//   identifier: string;
// };

// declare global {
//   interface window {
//     localStorage: Storage;
//   }
//   interface Window {
//     Clerk: {
//       session?: {
//         getToken: (options: { template: string }) => Promise<string>;
//       };
//     };
//   }
// }

// export function useLocalStorage<T>({
//   initialData,
//   identifier,
// }: useLocalStorageProps<T>) {
//   const [data, setData] = useState<T>(
//     (window.localStorage.getItem(identifier) as T) || initialData
//   );

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const item = window.localStorage.getItem(identifier);
//       if (item) {
//         setData(JSON.parse(item));
//       }
//     }
//   }, [identifier]);

//   useEffect(() => {
//     window.localStorage.setItem(
//       identifier,
//       typeof data != "string" ? JSON.stringify(data) : data
//     );
//   }, [data, identifier]);

//   const setToLocalStorage = (newData: T) => {
//     setData(newData);
//   };

//   const clearLocalStorage = () => {
//     window.localStorage.removeItem(identifier);
//     setData(initialData);
//   };

//   return { data, setToLocalStorage, clearLocalStorage };
// }

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
  const isBrowser = typeof window !== "undefined";

  // Ленивая инициализация состояния
  const [data, setData] = useState<T>(() => {
    if (isBrowser) {
      const item = window.localStorage.getItem(identifier);
      return item ? (JSON.parse(item) as T) : initialData;
    }
    return initialData; // Возвращаем начальные данные для SSR
  });

  // Синхронизация с localStorage при загрузке
  useEffect(() => {
    if (isBrowser) {
      const item = window.localStorage.getItem(identifier);
      if (item) {
        setData(JSON.parse(item));
      }
    }
  }, [identifier]);

  // Обновление localStorage при изменении данных
  useEffect(() => {
    if (isBrowser) {
      window.localStorage.setItem(
        identifier,
        typeof data !== "string" ? JSON.stringify(data) : data
      );
    }
  }, [data, identifier]);

  const setToLocalStorage = (newData: T) => {
    setData(newData);
  };

  const clearLocalStorage = () => {
    if (isBrowser) {
      window.localStorage.removeItem(identifier);
      setData(initialData);
    }
  };

  return { data, setToLocalStorage, clearLocalStorage };
}
