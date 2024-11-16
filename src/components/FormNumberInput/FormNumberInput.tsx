import { useNumberState } from "@/tool-kit/hooks";
import { Input, InputProps } from "@nextui-org/react";
import { UseFormSetValue } from "react-hook-form";

type Props<T> = {
  setValue: UseFormSetValue<T>;
  name: keyof T;
  inputProps?: InputProps;
};

export const FormNumberInput = <T,>({
  setValue,
  inputProps,
  name,
}: Props<T>) => {
  const state = useNumberState({
    initValue: 0,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.onChange(e);
    // @ts-ignore
    setValue(name, state.rawValue.toString());
  };

  return <Input value={state.value} onChange={onChange} {...inputProps} />;
};
