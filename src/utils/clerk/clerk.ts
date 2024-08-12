/* eslint-disable prettier/prettier */
"use server";
import { createClerkClient } from "@clerk/nextjs/server";

// const isProduction = process.env.NODE_ENV === 'production';

// const clerkPublishableKey = isProduction 
//   ? process.env.CLERK_PUBLISHABLE_KEY 
//   : 'pk_test_cmVmaW5lZC1naWJib24tNDYuY2xlcmsuYWNjb3VudHMuZGV2JA';

// const clerkSecretKey = isProduction 
//   ? process.env.CLERK_SECRET_KEY 
//   : 'sk_test_Msbz2NEUEPtLVRgJ0yo0H4stPypUg9mzLFRYeKV2to';

const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY ;
const clerkSecretKey = process.env.CLERK_SECRET_KEY ;

const getClerkClient = async () => {
  return createClerkClient({
    secretKey: clerkSecretKey,
    publishableKey: clerkPublishableKey,
  });
};

export default getClerkClient;
