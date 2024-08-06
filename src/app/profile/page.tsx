import { DataTable } from "./_usersTable/data-table";
import RoleBasedRedirect from "@/components/roles/RoleBasedRedirect";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUserList } from "./_api/requests";
import { SignOutButton } from "@clerk/nextjs";
import RenderButton from "@/components/pdfGen";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["Get users for admin panel"],
    queryFn: async () => await getUserList(),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RoleBasedRedirect allowedRoles={["Админ"]}>
          <DataTable />
        </RoleBasedRedirect>
      </HydrationBoundary>
      <RenderButton />
      <SignOutButton></SignOutButton>
    </div>
  );
}
