import { useState, useEffect, ChangeEvent, useRef } from "react";

type UseNumberStateArgs = {
  initValue?: number;
  min?: number;
  max?: number;
  separator?: "," | " ";
};

export const getSeparatedNumber = (
  value: number,
  separator?: UseNumberStateArgs["separator"]
) => {
  let locale = "en";
  switch (separator) {
    case ",":
      locale = "en";
      break;
    case " ":
      locale = "ru";
    default:
      locale = "en";
      break;
  }
  return value?.toLocaleString(locale, {
    useGrouping: true,
  });
};

export const useNumberState = (
  { initValue = 0, min, max, separator = "," }: UseNumberStateArgs,
  dependencies: any[] = []
) => {
  const [state, setState] = useState<number>(initValue);
  const formatWithSeparator = (value: number, separator: string) => {
    let locale = "en";
    switch (separator) {
      case ",":
        locale = "en";
        break;
      case " ":
        locale = "ru";
      default:
        break;
    }
    return (
      value?.toLocaleString(locale, {
        useGrouping: true,
      }) || ""
    );
  };
  const [inputValue, setInputValue] = useState<string>(
    formatWithSeparator(initValue, separator)
  );

  const parseWithoutSeparator = (value: string) => {
    const numericValue = parseFloat(value.replace(/[\s,.]+/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const numericValue = parseWithoutSeparator(value);
    if (
      (min === undefined || numericValue >= min) &&
      (max === undefined || numericValue <= max)
    ) {
      setState(numericValue);
      setInputValue(formatWithSeparator(numericValue, separator));
    }
  };

  useEffect(() => {
    setState(initValue);
    setInputValue(formatWithSeparator(initValue, separator));
  }, [initValue, min, max, separator, ...dependencies]);

  return {
    value: inputValue,
    onChange: handleChange,
    rawValue: state,
  };
};
