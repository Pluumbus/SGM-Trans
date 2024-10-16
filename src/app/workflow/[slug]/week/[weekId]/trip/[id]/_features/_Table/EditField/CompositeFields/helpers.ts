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
  useMemo,
  useState,
} from "react";
import { isEqual } from "lodash";

export const useEditCargo = <T>({
  info,
  value,
  setValues,
}: {
  info: Cell<CargoType, ReactNode>;
  value: T;
  setValues: Dispatch<SetStateAction<T>>;
}) =>
  useMutation({
    mutationFn: async () =>
      await editCargo(
        info.column.columnDef!.accessorKey,
        value,
        info.row.original.id
      ),
    onSuccess: (data: CargoType) => {
      setValues(data[0][info.column.columnDef.accessorKey] as T);
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
    setValues,
  });

  useEffect(() => {

    if (
      !isEqual(debouncedValue, info.getValue() as T)
      // isEqualObject(info.getValue() as T, values)
    ) {
      mutate();
    }
  }, [debouncedValue]);

  return [values, setValues];
};
