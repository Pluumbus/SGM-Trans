"use client";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { ProfilePrize } from "@/app/(backend-logic)/profile/feature/Prize/Prize";
import { useUser } from "@clerk/nextjs";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { InputCards } from "./InputCards";
import { AvatarProfile } from "./Avatar";

import { CustomWeekSelector } from "@/app/(backend-logic)/statistics/_features/CustomWeekSelector";
import { useState } from "react";
import { BalanceHistory } from "./Balance";

export const TopProfile = () => {
  const { user } = useUser();
  const [weekNum, setWeekNum] = useState();

  return (
    <div>
      <span className="text-2xl ">Личный кабинет</span>
      <Card className="p-6 mt-4 w-full">
        <CardBody>
          <div className="flex gap-16 justify-between">
            <div className="flex gap-5 w-1/4">
              <AvatarProfile />
              <InputCards />
            </div>
            <div className="w-1/4">
              <BalanceHistory />
            </div>

            <RoleBasedWrapper
              allowedRoles={[
                "Логист Кз",
                // "Админ",
                "Супер Логист",
                "Логист Москва",
              ]}
            >
              <Card className="w-2/4">
                <div className="flex flex-col">
                  <div className="flex gap-7 p-3 justify-around">
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
                          // userId={"user_2myHMgc4DzpQ8jT8BdoqgcYTnj9"}
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
