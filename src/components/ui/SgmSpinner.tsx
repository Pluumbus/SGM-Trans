import truck from "@/app/_imgs/truck.gif";
import Image from "next/image";
import { useState, useEffect } from "react";

export const SgmSpinner = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>{loading && <Image src={truck} width={74} alt="sgm-truck" />}</div>
  );
};
