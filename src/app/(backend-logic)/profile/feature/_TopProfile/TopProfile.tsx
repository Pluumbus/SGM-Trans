"use client";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { CardContent } from "@/components/ui/card";
import { ProfilePrize } from "@/app/(backend-logic)/profile/feature/ProfileButton/Prize/Prize";
import { useUser } from "@clerk/nextjs";
import {
  Avatar,
  Card,
  CardBody,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";
import { InputCards } from "./InputCards";
import { useQuery } from "@tanstack/react-query";
import { getAllCargos } from "../../../workflow/[slug]/week/[weekId]/trip/_api";
import { AvatarProfile } from "./Avatar";

export const TopProfile = () => {
  const { user } = useUser();

  const { data } = useQuery({
    queryKey: ["getAllCargos"],
    queryFn: async () => await getAllCargos(),
  });

  const userCargos = data?.filter((c) => c.user_id == user?.id);
  return (
    <div>
      <span className="text-2xl ">Личный кабинет</span>
      <Card className="p-6 mt-4 w-2/3">
        <CardBody>
          <div className="flex gap-16  ">
            <AvatarProfile />
            <InputCards />
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
                    <span>{userCargos ? userCargos.length : 0}</span>
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
