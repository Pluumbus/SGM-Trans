import { DataTable } from "./_usersTable/data-table";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUserList } from "./_api/requests";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import RoleBasedWrapper from "@/components/roles/RoleBasedWrapper";

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
          <DataTable />
          {/* Print button for test only */}
        </RoleBasedWrapper>
      </HydrationBoundary>
      <Button color="danger">
        <SignOutButton>Выход</SignOutButton>
      </Button>
    </div>
  );
}
