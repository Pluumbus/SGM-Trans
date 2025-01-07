"use client";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import { FaCopy, FaDropbox } from "react-icons/fa6";
import { getCargosFromTheWeek } from "../api";
import {
  groupCargosByCity,
  GroupedResultType,
  sortDataByCity,
} from "../helpers";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { getVWSofCargos } from "../helpers";

export const WeekStats = ({ weekId }: { weekId: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: [`Week${weekId}`],
    queryFn: async () => await getCargosFromTheWeek(weekId),
  });
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [_, copyText] = useCopyToClipboard();

  const { toast } = useToast();
  const handleCopy = () => {
    const cargos = groupCargosByCity(data)?.find(
      (e) => e.city == selectedCity
    ).cargos;
    const summary = getVWSofCargos(cargos) as GroupedResultType;
    const txt = `Стоимость: ${summary.totalAmount}\nОбъем: ${summary.totalVolume}\nВес: ${summary.totalWeight}`;
    copyText(txt);
    toast({
      title: `Статистика по городу ${summary.city} скопирована`,
      description: txt,
    });
  };

  return (
    <div className="flex gap-2">
      <Autocomplete
        isLoading={isLoading}
        selectedKey={selectedCity}
        onSelectionChange={(e) => {
          setSelectedCity(e as string);
        }}
      >
        {groupCargosByCity(data).map((e) => (
          <AutocompleteItem key={e.city} value={e.city}>
            {e.city || <span className="font-semibold">Город неопределен</span>}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Button
        isIconOnly
        variant="flat"
        isDisabled={isLoading}
        onPress={() => {
          handleCopy();
        }}
      >
        <FaCopy size={16} />
      </Button>
      {/* 
      TODO: добавить модалку сюда с подробной инфой
      <Button isIconOnly variant="flat" isDisabled={isLoading}>
        <FaDropbox size={18} />
      </Button> */}
    </div>
  );
};
