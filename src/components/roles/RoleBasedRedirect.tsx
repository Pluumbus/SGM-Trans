"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const RoleBasedWrapper: React.FC<{
  allowedRoles: string[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userRole =
          isLoaded && (user?.publicMetadata.role as string | "Пользователь");
        if (allowedRoles.includes(userRole)) {
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
