"use client";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";
import { NextPage } from "next";
import { TopProfile } from "./feature/_TopProfile/TopProfile";
import { UsersDataTable } from "./UsersTable/data-table";
const Page: NextPage = () => {
  // const queryClient = new QueryClient();
  // queryClient.prefetchQuery({
  //   queryKey: ["Get users for admin panel"],
  //   queryFn: async () => await getUserList(),
  // });

  return (
    <div>
      <TopProfile />
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <RoleBasedWrapper allowedRoles={["Админ"]}>
        <UsersDataTable />
      </RoleBasedWrapper>
      {/* </HydrationBoundary> */}
      <Button color="danger">
        <SignOutButton>Выход</SignOutButton>
      </Button>
    </div>
  );
};

export default Page;
