// "use client";

// import React, { useEffect, useState } from "react";
// import { RedirectToSignIn, useUser } from "@clerk/nextjs";
// import { Role } from "./useRole";
// import { useRouter } from "next/navigation";

// const RoleBasedWrapper: React.FC<{
//   allowedRoles: Role[];
//   children: React.ReactNode;
//   exclude?: boolean;
// }> = ({ allowedRoles, children, exclude }) => {
//   const [hasAccess, setHasAccess] = useState(false);
//   const { user, isLoaded } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     const checkUserRole = () => {
//       try {
//         const userRole =
//           isLoaded && (user?.publicMetadata.role as string | "Пользователь");
//         if (
//           exclude
//             ? !allowedRoles.includes(userRole as Role)
//             : allowedRoles.includes(userRole as Role)
//         ) {
//           setHasAccess(true);
//         }
//       } catch (error) {
//         console.error("Error fetching user role:", error);
//       }
//     };
//     checkUserRole();
//   }, [allowedRoles, user]);
//   if (!hasAccess) {
//     return <></>;
//   }

//   return <>{children}</>;
// };

// export default RoleBasedWrapper;

"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Role } from "./useRole";
import { useRouter, usePathname } from "next/navigation";

const RoleBasedWrapper: React.FC<{
  allowedRoles: Role[];
  children: React.ReactNode;
  exclude?: boolean;
}> = ({ allowedRoles, children, exclude }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      try {
        if (!isLoaded) return;

        const userRole = (user?.publicMetadata.role as Role) || "Пользователь";

        const accessGranted = exclude
          ? !allowedRoles.includes(userRole)
          : allowedRoles.includes(userRole);

        setHasAccess(accessGranted);

        if (!accessGranted && userRole === "Пользователь") {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkAccess();
  }, [allowedRoles, user, isLoaded, exclude, router]);

  if (!isLoaded || !hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default RoleBasedWrapper;
