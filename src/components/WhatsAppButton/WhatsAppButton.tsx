"use client";

import { Button, ButtonProps } from "@nextui-org/react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export const WhatsAppButton = ({
  phoneNumber,
  ...buttonProps
}: {
  phoneNumber: string;
  buttonProps?: ButtonProps;
}) => {
  return (
    <Link
      href={`https://wa.me/${phoneNumber?.replace(/[\s-]/g, "")}`}
      target="_blank"
    >
      <Button isIconOnly color="success" variant="light" {...buttonProps}>
        <FaWhatsapp size={20} />
      </Button>
    </Link>
  );
};
