"use client";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Avatar } from "@nextui-org/react";
import { useRef } from "react";

export const AvatarProfile = () => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      user.setProfileImage({ file: file });
      toast({ title: "Аватар профиля изменён" });
    }
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="w-[14rem] h-[12rem] ">
      <div className="relative w-full h-full group">
        <Avatar
          alt="sgm-avatar"
          src={user?.imageUrl}
          size="lg"
          className="target w-full h-full shadow-md transition duration-300 group-hover:opacity-75 group-hover:scale-105 cursor-pointer"
        />
        <span
          onClick={handleAvatarClick}
          className="trigger absolute inset-0 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
        >
          Изменить
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};
