"use client";
import { PhoneNumber } from "@clerk/backend";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { useState } from "react";
// wip
export const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <div>
      <Button>PhoneVerification</Button>
    </div>
  );
};
