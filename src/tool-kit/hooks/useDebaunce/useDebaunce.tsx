import { useCallback, useEffect, useRef } from "react";

type UseDebounceFunction = (fn: () => void, delay: number) => () => void;

/** @param fn - function to delay @param delay - number in ms to delay the function */
export const useDebounce: UseDebounceFunction = (fn, delay) => {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedFn = useCallback(() => {
    if (debounceTimerRef.current !== undefined) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fn();
    }, delay);
  }, [fn, delay]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== undefined) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedFn]);

  return debouncedFn;
};
