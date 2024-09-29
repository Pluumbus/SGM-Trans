"use client";
import { useMutation } from "@tanstack/react-query";
import { editCargo } from "../api";
import { Cell } from "@tanstack/react-table";
import { CargoType } from "@/app/workflow/_feature/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export const useEditCargo = <T>({
  info,
  value,
}: {
  info: Cell<CargoType, ReactNode>;
  value: T;
}) =>
  useMutation({
    mutationFn: async () => {
      await editCargo(
        info.column.columnDef!.accessorKey,
        value,
        info.row.original.id
      );
    },
  });

export const useDebouncedState = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useCompositeStates = <T>(
  info: Cell<CargoType, ReactNode>
): [values: T, setValues: Dispatch<SetStateAction<T>>] => {
  const [values, setValues] = useState<T>(info.getValue() as T);

  const debouncedValue = useDebouncedState(values, 500);

  const { mutate } = useEditCargo({
    info,
    value: values,
  });

  useEffect(() => {
    if (
      Object.values(debouncedValue).some((e) =>
        Object.keys(info.getValue()).some((el) => e !== info.getValue()[el])
      )
    ) {
      mutate();
    }
  }, [debouncedValue]);

  return [values, setValues];
};
