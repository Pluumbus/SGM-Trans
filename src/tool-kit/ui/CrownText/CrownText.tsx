import Image from "next/image";
import { ReactNode } from "react";

export const CrownText = ({
  text,
  w,
  h,
}: {
  text: ReactNode;
  w?: number;
  h?: number;
}) => {
  return (
    <div className="w-fit pr-4 pt-2">
      <div className="relative inline-block">
        <span>{text}</span>
        <Image
          alt="sgm-crown"
          src={"/imgs/crown.png"}
          height={h || 40}
          width={w || 40}
          className="absolute -top-2 -right-7 rotate-[35deg]"
        />
      </div>
    </div>
  );
};
