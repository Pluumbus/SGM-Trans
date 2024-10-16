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

  useEffect(() => {
    if (!isEqual(values, info.getValue())) {
      console.log("isEqual:", !isEqual(debouncedValue, info.getValue()));

      setValues(info.getValue() as T);
    }
  }, [info.getValue()]);

  const debouncedValue = useDebouncedState(values, 200);

  const { mutate } = useEditCargo({
    info,
    value: values,
    setValues,
  });

  useEffect(() => {
    if (!isEqual(debouncedValue, info.getValue() as T)) {
      mutate();
    }
  }, [debouncedValue]);

  return [values, setValues];
};
