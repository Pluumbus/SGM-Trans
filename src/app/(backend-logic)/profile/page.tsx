import { UsersDataTable } from "./_usersTable/data-table";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["Get users for admin panel"],
    queryFn: async () => await getUserList(),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RoleBasedWrapper allowedRoles={["Админ"]}>
          <UsersDataTable />
        </RoleBasedWrapper>
      </HydrationBoundary>
      <Button color="danger">
        <SignOutButton>Выход</SignOutButton>
      </Button>
    </div>
  );
}
