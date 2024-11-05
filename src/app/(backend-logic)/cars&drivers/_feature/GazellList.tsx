import { toast } from "@/components/ui/use-toast";
import { Card, Listbox, ListboxItem } from "@nextui-org/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { FullDriversType } from "../../../../lib/references/drivers/feature/types";

export const GazellList = ({
  driversGazellData,
}: {
  driversGazellData: FullDriversType[];
}) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const handleCopyDriverData = (id) => {
    const dataToCopy = driversGazellData.filter((car) => car.id == id)[0];
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
  return (
    <Card className="w-1/4">
      <Listbox
        aria-label="drivers-list"
        onAction={(key) => handleCopyDriverData(key)}
      >
        {driversGazellData != undefined &&
          driversGazellData?.map((gzl) => (
            <ListboxItem key={gzl.id} className="border-b">
              {(gzl.drivers[0]?.name || "Без водителя") + " | " + gzl.car}
            </ListboxItem>
          ))}
      </Listbox>
    </Card>
  );
};
