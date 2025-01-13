"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Role } from "./useRole";

const RoleBasedWrapper: React.FC<{
  allowedRoles: Role[];
  children: React.ReactNode;
  exclude?: boolean;
}> = ({ allowedRoles, children, exclude }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userRole =
          isLoaded && (user?.publicMetadata.role as string | "Пользователь");
        if (
          exclude
            ? !allowedRoles.includes(userRole as Role)
            : allowedRoles.includes(userRole as Role)
        ) {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    checkUserRole();
  }, [allowedRoles, user]);
  if (!hasAccess) {
    return <></>;
  }

  return <>{children}</>;
};

export default RoleBasedWrapper;
