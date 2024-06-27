import { NextRequest, NextResponse } from "next/server";
import getClerkClient from "@/utils/clerk/clerk";

export async function POST(req: NextRequest) {
  const clerk = await getClerkClient();

  try {
    const { userId, balance } = await req.json();

    await clerk.users.updateUser(userId, { publicMetadata: { balance } });

    return NextResponse.json({ message: "Balance updated" }, { status: 200 });
  } catch (error) {
    console.error("Errors issuing balance:", error);
    return NextResponse.json(
      { error: "Errors issuing balance" },
      { status: 500 },
    );
  }
}
