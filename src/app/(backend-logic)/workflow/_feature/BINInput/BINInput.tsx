"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { getAllCargos } from "../../[slug]/week/[weekId]/trip/_api";
import {
  Card,
  CardBody,
  Input,
  InputProps,
  ScrollShadow,
  Spinner,
} from "@nextui-org/react";

type Props = {
  inputProps?: InputProps;
  onChange?: (str: string) => void;
  initValue?: string;
};

export const BINInput = ({ inputProps, onChange, initValue }: Props) => {
  const [filter, setFilter] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ["get BINS"],
    queryFn: async () =>
      await getAllCargos("client_bin").then((data) =>
        data.map((e) => e.client_bin.xin.trim())
      ),
  });

  const filteredData =
    !isLoading &&
    data
      ?.filter((e) => e.toLowerCase().includes(filter.toLowerCase()))
      .slice(0, 15);

  const handleSelect = (value: string) => {
    setFilter(value);
    setHighlightedIndex(-1);
    setIsCardVisible(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredData || filteredData.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredData.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredData.length) {
          handleSelect(filteredData[highlightedIndex]);
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [inputRef.current]);

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const highlightedItem = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      highlightedItem?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (initValue) {
      setFilter(initValue);
    }
    return () => {
      setFilter("");
    };
  }, [initValue]);

  return (
    <div className="w-full relative">
      <div ref={inputRef}>
        <Input
          {...inputProps}
          label="БИН"
          className="relative"
          value={filter}
          onFocus={() => setIsCardVisible(true)}
          onBlur={() => setIsCardVisible(false)}
          onChange={(e) => {
            setFilter(e.target.value);
            onChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          endContent={isLoading && <Spinner size="sm" color="default" />}
        />
      </div>
      {!isLoading && isCardVisible && filter && filteredData?.length > 0 && (
        <Card className="mt-2 absolute z-50" style={{ width: inputWidth }}>
          <ScrollShadow className="max-h-[200px] flex flex-col" ref={listRef}>
            {filteredData.map((e, index) => (
              <Card
                isHoverable
                key={index}
                shadow="none"
                className={`cursor-pointer min-h-10 overflow-y-hidden ${
                  highlightedIndex === index ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <CardBody
                  className="py-2 px-3"
                  onClick={() => {
                    handleSelect(e);
                  }}
                >
                  {e}
                </CardBody>
              </Card>
            ))}
          </ScrollShadow>
        </Card>
      )}
    </div>
  );
};
