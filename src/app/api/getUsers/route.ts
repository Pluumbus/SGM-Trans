import { NextRequest, NextResponse } from "next/server";
import getClerkClient from "@/utils/clerk/clerk";
import { User } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const clerk = await getClerkClient();

  try {
    const users = await clerk.users.getUserList();
    const userList = users.data.map((user: User) => ({
      id: user.id,
      userName: user.fullName || "Без имени",
      avatar: user.imageUrl,
      role: user.publicMetadata?.role as string | undefined,
      balance: user.publicMetadata?.balance as number | 0,
    }));

    return NextResponse.json(userList, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 },
    );
  }
}
