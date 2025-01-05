import { useNumberState } from "@/tool-kit/hooks";
import { Input, InputProps } from "@nextui-org/react";
import { useEffect } from "react";
import { Path, PathValue, UseFormSetValue } from "react-hook-form";

type Props<T> = {
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  inputProps?: InputProps;
  initValue?: number;
};

export const FormNumberInput = <T,>({
  setValue,
  inputProps,
  initValue,
  name,
}: Props<T>) => {
  const state = useNumberState({
    initValue: initValue || 0,
  });

  useEffect(() => {
    if (state.rawValue) {
      setValue(name, state.rawValue.toString() as PathValue<T, Path<T>>);
    }
  }, [state]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.onChange(e);
    // setValue(name, state.rawValue.toString() as PathValue<T, Path<T>>);
  };

  return <Input value={state.value} onChange={onChange} {...inputProps} />;
};
