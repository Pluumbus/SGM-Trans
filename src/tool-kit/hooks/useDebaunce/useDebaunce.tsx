import { useCallback, useEffect, useRef } from "react";

type UseDebounceFunction = () => (fn: () => void, delay: number) => void;

export const useDebounce: UseDebounceFunction = () => {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  let fun: Function | undefined = undefined;

  /** @param fn - function to delay @param delay - number in ms to delay the function */
  const useFn = (fn, delay) => {
    if (debounceTimerRef.current !== undefined) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fn();
    }, delay);

    fun = fn;

    return fn;
  };
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== undefined) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fun]);

  return useFn;
};
