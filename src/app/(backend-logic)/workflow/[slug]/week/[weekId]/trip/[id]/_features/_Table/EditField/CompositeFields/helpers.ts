"use client";
import { useMutation } from "@tanstack/react-query";
import { editCargo, editWHCargo } from "../api";
import { Cell } from "@tanstack/react-table";
import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isEqual } from "lodash";
import { WHCargoType } from "@/app/(backend-logic)/workflow/_feature/AddCargoModal/WHcargo/types";
import { useTableMode } from "../../TableMode.context";

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

const useEditWHCargo = <T>({
  info,
  value,
  setValues,
}: {
  info: Cell<WHCargoType, ReactNode>;
  value: T;
  setValues: Dispatch<SetStateAction<T>>;
}) =>
  useMutation({
    mutationFn: async () =>
      await editWHCargo(
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
      setValues(info.getValue() as T);
    }
  }, [info.getValue()]);

  const debouncedValue = useDebouncedState(values, 500);

  const { tableMode } = useTableMode();

  const { mutate: editWhCargo } = useEditWHCargo({
    info,
    value: values,
    setValues,
  });
  const { mutate } = useEditCargo({
    info,
    value: values,
    setValues,
  });

  useEffect(() => {
    if (!isEqual(debouncedValue, info.getValue() as T)) {
      tableMode == "wh-cargo" ? editWhCargo() : mutate();
    }
  }, [debouncedValue]);

  return [values, setValues];
};
