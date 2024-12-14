import { useCallback, useEffect, useRef } from "react";

type UseDebounceFunction = () => {
  debounce: (fn: () => void, delay: number) => void;
  cancel: () => void;
};

export const useDebounce: UseDebounceFunction = () => {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  /** Executes the function after a delay */
  const debounce = (fn: () => void, delay: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fn();
    }, delay);
  };

  /** Cancels the execution of the debounced function */
  const cancel = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return { debounce, cancel };
};
