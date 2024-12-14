import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { CardContent } from "@/components/ui/card";
import { ProfilePrize } from "@/components/ui/ProfileButton/Prize/Prize";
import { useUser } from "@clerk/nextjs";
import {
  Avatar,
  Card,
  CardBody,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";

export const TopMenu = () => {
  const { user } = useUser();
  return (
    <div>
      <span className="text-2xl ">Личный кабинет</span>
      <Card className="p-6 mt-4">
        <CardBody>
          <div className="flex gap-16">
            <div className="w-[12rem] h-[12rem]">
              <Avatar
                src={user?.imageUrl}
                size="lg"
                className="w-[12rem] h-[12rem]"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-5">
                <Input
                  value={user?.firstName}
                  variant="faded"
                  label="Имя"
                  labelPlacement="outside"
                />
                <Input
                  value={user?.lastName}
                  variant="faded"
                  label="Фамилия"
                  labelPlacement="outside"
                />
              </div>
              <Input
                value={user?.publicMetadata?.role as string}
                isReadOnly={true}
                label="Должность"
                labelPlacement="outside"
                variant="faded"
              />
            </div>
            <RoleBasedWrapper allowedRoles={["Админ", "Логист"]}>
              <Card>
                <div className="flex">
                  <div className="flex flex-col p-3 items-center mt-12">
                    <span>Баланс</span>
                    <Divider />
                    <span>
                      {(user?.publicMetadata?.balance as number) || 0}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 items-center">
                    <span className="text-4xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500 font-cinzel">
                      Премия
                    </span>
                    <Divider />
                    <ProfilePrize isNumberOnly={true} userId={user?.id} />
                  </div>

                  <div className="flex flex-col p-3 items-center mt-12">
                    <span>Грузы</span>
                    <Divider />
                    <span>{0}</span>
                  </div>
                </div>
              </Card>
            </RoleBasedWrapper>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
