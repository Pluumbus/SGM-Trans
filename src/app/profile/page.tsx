import { ClerkProvider, SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { DataTable } from "./_usersTable/data-table";
import { columns } from "./_usersTable/columns";
import getClerkClient from "@/utils/clerk/clerk";
import { User } from "@clerk/nextjs/server";
import { UsersList } from "../../components/roles/types";
import RoleBasedRedirect from "@/components/roles/RoleBasedRedirect";
import AssignRole from "./_feature/assignRole";
import React from "react";

async function getData(): Promise<UsersList[]> {
  const users = await await (await getClerkClient()).users.getUserList();
  const userList = users.data.map((user: User) => ({
    id: user.id,
    userName: user.fullName || "Имя отсутствует",
    email: user.emailAddresses[0]?.emailAddress,
    avatar: user.imageUrl,
    role: user.publicMetadata?.role! as string | undefined,
    balance: user.publicMetadata?.balance! as string | undefined,
  }));
  return userList as UsersList[];
}
export default async function ProfilePage() {
  const data = await getData();
  return (
    <div>
      <RoleBasedRedirect allowedRoles={["Админ"]}>
        <DataTable columns={columns} data={data} />
      </RoleBasedRedirect>
      {/* <AssignRole /> */}
      <div className="flex justify-end mt-10">
        <Button color="danger">
          <SignOutButton>Выйти</SignOutButton>
        </Button>
      </div>
    </div>
  );
}
