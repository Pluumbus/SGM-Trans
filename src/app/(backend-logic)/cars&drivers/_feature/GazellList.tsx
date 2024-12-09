"use client";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  Listbox,
  ListboxItem,
  Spinner,
} from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import gazellImg from "@/app/_imgs/gazell-icon.png";
import { useQuery } from "@tanstack/react-query";
import { getFullGazellsData } from "../_api";
import Image from "next/image";

export const GazellList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetGazellAndDrivers"],
    queryFn: async () => await getFullGazellsData(),
  });
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  console.log(data);
  const handleCopyDriverData = (id) => {
    const dataToCopy = data.filter((car) => car.id == id)[0];
    copyToClipboard(
      dataToCopy.drivers[0].name +
        "\n" +
        "Автомобиль: " +
        dataToCopy.car +
        "\n" +
        "Гос.номер: " +
        dataToCopy.state_number +
        "\n" +
        "Номер: " +
        dataToCopy.drivers[0].passport_data.id +
        "\n" +
        "Выдан: " +
        dataToCopy.drivers[0].passport_data.issued +
        "\n" +
        "Дата: " +
        dataToCopy.drivers[0].passport_data.date
    );
    toast({
      title: `Данные водителя успешно скопированы в буфер обмена`,
    });
  };
  if (isLoading) return <Spinner />;
  return (
    <Card className="h-full">
      <CardHeader className="flex justify-center">
        <Image src={gazellImg} alt="gazell-icon" width={50} />
      </CardHeader>
      <Listbox
        aria-label="drivers-list"
        onAction={(key) => handleCopyDriverData(key)}
      >
        {data?.map((gzl) => (
          <ListboxItem key={gzl.id} className="border-b">
            {(gzl.drivers[0]?.name || "Без водителя") + " | " + gzl.car}
          </ListboxItem>
        ))}
      </Listbox>
    </Card>
  );
};
