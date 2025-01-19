"use server";

import { createClerkClient } from "@clerk/nextjs/server";

// const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;
// const clerkSecretKey = process.env.CLERK_SECRET_KEY!;
const clerkPublishableKey = "pk_live_Y2xlcmsuc2dtLXRyYW5zLmNvbSQ";
const clerkSecretKey = "sk_live_NzMWVVgm67HJP3vuMYNNpzKF2w5y2IYzDwq9dFDlXF";

const getClerkClient = async () => {
  return createClerkClient({
    secretKey: clerkSecretKey,
    publishableKey: clerkPublishableKey,
  });
};

export default getClerkClient;
