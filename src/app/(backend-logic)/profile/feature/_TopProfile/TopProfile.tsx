"use client";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
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
import {
  currentWeekIndicator,
  isDateInCurrentWeek,
} from "@/app/(backend-logic)/workflow/_feature/WeekCard/WeekCard";
import { CustomWeekSelector } from "@/app/(backend-logic)/statistics/_features/CustomWeekSelector";
import { useState } from "react";

export const TopProfile = () => {
  const { user } = useUser();
  const [weekNum, setWeekNum] = useState();

  const { data } = useQuery({
    queryKey: ["getAllCargos"],
    queryFn: async () => await getAllCargos(),
  });

  return (
    <div>
      <span className="text-2xl ">Личный кабинет</span>
      <Card className="p-6 mt-4 w-2/3">
        <CardBody>
          <div className="flex gap-16  ">
            <AvatarProfile />
            <InputCards />
            <RoleBasedWrapper allowedRoles={["Админ", "Логист"]}>
              <Card className="w-1/3">
                <div className="flex flex-col">
                  {/* <div className="flex flex-col p-3 items-center">
                    <span>Баланс</span>
                    <Divider />
                    <span>
                      {(user?.publicMetadata?.balance as number) || 0}
                    </span>
                  </div> */}
                  <div className="flex gap-7 p-3 ">
                    <div className="w-2/4">
                      <CustomWeekSelector setWeekNum={setWeekNum} />
                    </div>

                    <div>
                      <span className="text-4xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500 font-cinzel">
                        Премия
                      </span>
                      <Divider />
                      <div className="flex flex-col items-center ">
                        <ProfilePrize
                          isNumberOnly={true}
                          userId={user?.id}
                          weekNum={weekNum}
                        />
                      </div>
                    </div>
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
