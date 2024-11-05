import truck from "@/app/_imgs/truck.gif";
import Image from "next/image";

export const SgmSpinner = () => {
  return (
    <div>
      <Image src={truck} width={74} alt="sgm-truck" />
    </div>
  );
};
