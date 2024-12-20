"use client";
import { toast } from "@/components/ui/use-toast";
import { setUserName } from "@/lib/references/clerkUserType/SetUserFuncs";
import { useConfirmContext } from "@/tool-kit/hooks";
import { useUser } from "@clerk/nextjs";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEventHandler, useState } from "react";

export const InputCards = () => {
  const { user } = useUser();
  const [name, setName] = useState<{ firstname: string; lastname: string }>({
    firstname: user?.firstName,
    lastname: user?.lastName,
  });

  const { openModal } = useConfirmContext();

  const { mutate, isPending } = useMutation({
    mutationKey: ["SetUserData"],
    mutationFn: async () =>
      await setUserName({
        userId: user?.id,
        fistName: name.firstname === "" ? user?.firstName : name.firstname,
        lastName: name.lastname === "" ? user?.lastName : name.lastname,
      }),
    onSuccess: () => {
      toast({
        title: `Ваше Ф.И. успешно изменено на ${name.firstname + " " + name.lastname}`,
      });
    },
    onError: () => {
      toast({ title: `Ошибка`, description: "Попробуйте позже" });
    },
  });
  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setName((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeName = () => {
    openModal({
      action: async () => mutate(),
      title: "Подтвердите действие",
      description: `Вы уверены, что хотите изменить ${user?.firstName + " " + user?.lastName} на ${name.firstname + " " + name.lastname || user?.firstName + name.lastname || user?.lastName}.`,
      buttonName: "Подтвердить",
      isLoading: isPending,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-5">
        <Input
          name="firstname"
          placeholder={user?.firstName}
          // value={user?.firstName}
          variant="faded"
          label="Имя"
          labelPlacement="outside"
          onChange={handleSetName}
        />
        <Input
          name="lastname"
          placeholder={user?.lastName}
          variant="faded"
          label="Фамилия"
          labelPlacement="outside"
          onChange={handleSetName}
        />
      </div>
      {(name.firstname !== user?.firstName ||
        name.lastname !== user?.lastName) &&
        (name.firstname || name.lastname) !== "" && (
          <Button variant="shadow" color="success" onPress={handleChangeName}>
            Изменить
          </Button>
        )}
      <Input
        value={user?.publicMetadata?.role as string}
        isReadOnly
        // isDisabled
        label="Должность"
        labelPlacement="outside"
        variant="faded"
      />
    </div>
  );
};
