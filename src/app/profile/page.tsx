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
<<<<<<< HEAD
import RenderButton from "@/components/pdfGen";
=======
>>>>>>> 6e60f841c77c29d07b4b38ff5a7a1e28c2ddb145

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
<<<<<<< HEAD
      <RenderButton />
=======
>>>>>>> 6e60f841c77c29d07b4b38ff5a7a1e28c2ddb145
      <SignOutButton></SignOutButton>
    </div>
  );
}
