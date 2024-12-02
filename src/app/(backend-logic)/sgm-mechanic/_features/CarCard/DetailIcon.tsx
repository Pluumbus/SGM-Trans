import { FaCogs, FaOilCan, FaCarBattery } from "react-icons/fa";
import { TbManualGearbox } from "react-icons/tb";
import { TbAutomaticGearbox } from "react-icons/tb";
import { GiGearStick } from "react-icons/gi";
import { DetailsName } from "@/lib/references/drivers/feature/types";

export const DetailIcon = ({ name }: { name: DetailsName }) => {
  return <></>;

  switch (name) {
    case DetailsName.Transmission:
      return <GiGearStick size={20} title="КПП" />;
    case DetailsName.Engine:
      return <TbManualGearbox size={20} title="Двигатель" />;
    case DetailsName.Reducer:
      return <TbAutomaticGearbox size={20} title="Редуктор" />;
    case DetailsName.SL:
      return <FaOilCan size={20} title="Смазка подвески" />;
    case DetailsName.BL:
      return <FaOilCan size={20} title="Смазка подшипников" />;
    default:
      return <FaCarBattery title="Неизвестная деталь" />;
  }
};
