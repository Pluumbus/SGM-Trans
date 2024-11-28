import { useNumberState } from "@/tool-kit/hooks";
import { Input, InputProps } from "@nextui-org/react";
import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

type Props<T> = {
  setValue: UseFormSetValue<T>;
  name: keyof T;
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
      // @ts-ignore
      setValue(name, state.rawValue.toString());
    }
  }, [state]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.onChange(e);
  };

  return <Input value={state.value} onChange={onChange} {...inputProps} />;
};
